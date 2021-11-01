function formatBytes(bytes, decimals = 2, k = 1024) {
    if (bytes == 0) return "0 Bytes"

    let sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    let d = Math.floor(Math.log(bytes) / Math.log(k))
    let c = parseFloat((bytes / Math.pow(k, d)).toFixed(Math.max(0, decimals)))

    return `${c} ${sizes[d]}`
} // END function formatBytes


function makeFileName(fileExtension) {
    var d = new Date().toISOString()
        .replace(/:/g, '-').replace(/\./g, '-')
        .replace(/T/g, '_').replace(/Z/g, '')

    return `ScreenRecord_${d}.${fileExtension}`
} // END function makeFileName