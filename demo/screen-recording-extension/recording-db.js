window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var db
var request = window.indexedDB.open("recordings-db", 1)

request.onerror = function(event) {
    console.log("error: ")
}

request.onsuccess = function(event) {
    db = request.result
    console.log("success: " + db)
}

request.onupgradeneeded = function(event) {
    var db = event.target.result
    db.createObjectStore("recordings", {
        keyPath: "id"
    })
}

function addRecording(obj) {
    console.log(obj)
    var request = db.transaction(["recordings"], "readwrite").objectStore("recordings").add(obj)
    request.onsuccess = function(event) {
        console.log("Recording saved locally.")
    }
    request.onerror = function(event) {
        console.log("Error saving recording saved locally.")
    }
}