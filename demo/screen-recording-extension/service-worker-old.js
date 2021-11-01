// //prefixes of implementation that we want to test
// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// //prefixes of window.IDB objects
// window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
// window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
// if (!window.indexedDB) {
//     window.alert("Your browser doesn't support a stable version of IndexedDB.")
// }
var data = {
    ttt: "t6est"
};
dataType = "application/JSON";
url = "192.168.6.26:1880/screenRec";
console.log("DDD");

function postAjax(url, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }).join('&');
    var xhr = new ActiveXObject("Microsoft.XMLHTTP"); // : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState > 3 && xhr.status == 200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
}
// example request with data object
//postAjax(url, data, function(data) { console.log(data); });
var db;
var request = indexedDB.open("recordings-db", 1);
request.onerror = function(event) {
    console.log("error: ");
};
request.onsuccess = function(event) {
    db = request.result;
    console.log("success: " + db);
};
request.onupgradeneeded = function(event) {
    var db = event.target.result;
    db.createObjectStore("recordings", {
        keyPath: "id"
    });
}
check_recordings();
// if ('serviceWorker' in navigator) {
//     console.log('CLIENT: service worker registration in progress.');
//     navigator.serviceWorker.register('/service-worker.js').then(function() {
//         check_recordings();
//         console.log('CLIENT: service worker registration complete.');
//     }, function() {
//         console.log('CLIENT: service worker registration failure.');
//     });
// } else {
//     console.log('CLIENT: service worker is not supported.');
// }
function check_recordings() {
    console.log(db);
    var objectStore = db.transaction("recordings").objectStore("recordings");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log("cursor at: " + cursor.key + " | Agent: " + cursor.value.agent);
            cursor.continue();
        } else {
            alert("No more entries!");
        }
    };
}