window.indexedDB      = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction
window.IDBKeyRange    = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange


if (!window.indexedDB) {
    window.alert('Your browser doesn\'t support a stable version of IndexedDB.')
}


const dbName  = 'record-db-temp'
const dbTable = 'recordings'

var request  = window.indexedDB.open(dbName, 1)
var allEntries = []

var db



request.onupgradeneeded = function(event) {
    db = event.target.result
    db.createObjectStore(dbTable)
    console.log('Database upgraded:', db)
}


request.onsuccess = function(event) {
    db = request.result
    console.log('Database:', db)
}


request.onerror = function(event) {
    console.error('DB Error:', event)
}



function addRecordingToDatabase(blob, id) {
    console.log('Adding recording to database:', blob)

    try {
        const store = db.transaction([dbTable], 'readwrite').objectStore(dbTable)

        let request = store.add(blob, id)

        request.onsuccess = function (event) {
            console.log('Recording added to database.')
        }

        request.onerror = function (error) {
            console.error('Error while adding to database:', error)
        }
    } catch (exception) {
        let reader = new FileReader()

        reader.onloadend = function(event) {
            const store = db.transaction([dbTable], 'readwrite').objectStore(dbTable)

            let data = event.target.result
            let request = store.add(data, id)

            request.onsuccess = function (event) {
                console.log('Recording added to database as string.')
            }
    
            request.onerror = function (error) {
                console.error('Error while adding to database as string:', error)
            }
        }

        reader.readAsDataURL(blob)
    }
}


function makeHistoryCard(cursor) {
    if (!cursor) return {}

    const name_parts = cursor.key.split('ScreenRecord_')[1].split('.')

    const json = {
        id           : cursor.key,
        name         : name_parts[0],
        ext          : name_parts[1],
        size         : cursor.value.size,
        display_size : formatBytes(cursor.value.size)
    }

    const html = `
        <div class="col-4" style="padding: 1rem">
            <div class="card" id="${json.id}">
                <div class="card-body">
                    <h5 class="card-title" style="text-align: center">${json.name}</h5>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item" style="padding: 0.5rem 0">
                            <b>Format:</b> ${json.ext}
                        </li>
                        <li class="list-group-item" style="padding: 0.5rem 0">
                            <b>Size:</b> ${json.display_size}
                        </li>
                    </ul>
                </div>

                <img src="https://i.picsum.photos/id/315/2100/1500.jpg?hmac=-04N-t7k_WwNeI30ryvWT4KGzy7XVdsw41fNRDFizck" class="card-img-bottom" alt="...">
            </div>
        </div>
    `
    
    return {
        json: json,
        html: html
    }
}


function readTable() {
    let open = indexedDB.open(dbName, 1)
    let container = document.getElementById('playback-history')

    return new Promise(resolve => {
        open.onsuccess = evt => {
            let db = open.result
            let tran = db.transaction(dbTable)
            let objectStore = tran.objectStore(dbTable)

            if (allEntries.length == 0) {
                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result
                    
                    if (cursor) {
                        console.log('Cursor:', cursor)
                        const card = makeHistoryCard(cursor)

                        container.innerHTML += card.html
                        allEntries.push(card.json)

                        cursor.continue()
                    }
                }
            } else { // allEntries.length != 0
                var newEntries = []

                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result

                    if (cursor) {
                        const card = makeHistoryCard(cursor)
                        const found = allEntries.some(el => el.id === card.json.id)

                        if (!found) {
                            container.innerHTML += card.html
                            allEntries.push(card.json)
                        }

                        newEntries.push(card.json)
                        
                        cursor.continue()
                    } else { // No more entries
                        allEntries.forEach(function (obj) {
                            const found = newEntries.some(el => el.call_id === obj.call_id)

                            if (!found) {
                                var temp_elem = document.getElementById(obj.call_id)

                                temp_elem.className += " removed"

                                setTimeout(function () {
                                    temp_elem.className += " hidden"
                                }, 1000)
                            }
                        })
                    }
                }
            }
        }
    })
}