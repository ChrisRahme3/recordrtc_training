console.log("TEST");
readTable("recordings", "recordings-db");

function readTable(table, dbName) {
    let open = indexedDB.open(dbName, 1);
    return new Promise(resolve => {
        open.onsuccess = evt => {
            let db = open.result;
            let tran = db.transaction(table);
            let objectStore = tran.objectStore(table);
            // let idx = objStore.index(idxName);
            // let tranCursor = idx.openCursor();
            // let result = [];
            // tranCursor.onsuccess = evt => {
            //     let cursor = evt.target.result;
            //     if (!cursor) return resolve(result);
            //     let item = cursor.value;
            //     result.push(item);
            //     cursor.continue();
            // };
            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    // console.log("cursor at: " + cursor.key + " | Agent: " + cursor.value.agent);
                    // postData('http://192.168.6.26:1880/screenRec', { agent: cursor.value.agent, key: cursor.key }).then(data => {
                    //     console.log(data); // JSON data parsed by `data.json()` call
                    // });
                    console.log("uploading...");
                    //const blob = convertBase64ToBlob(cursor.value.recording);
                    // console.log(convertBase64ToBlob(cursor.value.recording));
                    var json = {
                        key: cursor.key,
                        call_id: cursor.value.id,
                        agent: cursor.value.agent,
                        recording: cursor.value.recording
                    };
                    //const blobUrl = URL.createObjectURL(blob);
                    //console.log(blobUrl);
                    //console.log(json);
                    formData = new FormData();
                    formData.append("content", cursor.value.recording);
                    // postData('http://192.168.6.26:1880/screenRec', json).then(data => {
                    //     console.log(data); // JSON data parsed by `data.json()` call
                    // });

                    console.log(json);

                    postData('http://192.168.6.26:1880/screenRec', json).then(data => {
                        console.log("here ta7et");
                        console.log(data); // JSON data parsed by `data.json()` call
                    });
                    cursor.continue();
                }
                // else {
                //alert("No more entries!");
                // }
            };
        };
    });
}
// Example POST method implementation:
async function postData(url = '', data = {}) {
    console.log("tetetette");
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            //'Content-Type': "video/x-matroska;codecs=avc1,opus"
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
        //body: data
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function b64toBlob2(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'video/x-matroska' });
}
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
/**
 * Convert BASE64 to BLOB
 * @param base64Image Pass Base64 image data to convert into the BLOB
 */
function convertBase64ToBlob(base64Image) {
    // Split into two parts
    const parts = base64Image.split(';base64,');
    // Hold the content type
    const imageType = parts[0].split(':')[1];
    // Decode Base64 string
    const decodedData = atob(parts[1]);
    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);
    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
        uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
}