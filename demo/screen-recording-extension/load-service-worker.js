if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(registration => navigator.serviceWorker.ready).then(registration => { // register sync
        // document.getElementById('requestButton').addEventListener('click', () => {
        //     registration.sync.register('image-fetch').then(() => {
        //         console.log('Sync registered');
        //     });
        // });
    });
} else {
    document.getElementById('requestButton').addEventListener('click', () => {
        console.log('Fallback to fetch the image as usual');
    });
}