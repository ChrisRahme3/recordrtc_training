function formatBytes(bytes, k = 1000, decimals = 2) {
    if (bytes == 0) return "0 Bytes"
    if (k != 1024 && k != 1000) k = 1000

    const sizes_1000 = ["B", "KB",  "MB",  "GB",  "TB",  "PB",  "EB",  "ZB",  "YB" ]
    const sizes_1024 = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
    const sizes = (k == 1000) ? sizes_1000 : sizes_1024

    const d = Math.floor(Math.log(bytes) / Math.log(k))
    const c = parseFloat((bytes / Math.pow(k, d)).toFixed(Math.max(0, decimals)))

    return `${c} ${sizes[d]}`
} // END function formatBytes


function makeFileName(fileExtension) {
    var z  = n => ('0'  + n).slice(-2)
    var zz = n => ('00' + n).slice(-3)

    var d = new Date()
    d = d.getFullYear()   + '-' +
        z(d.getMonth()+1) + '-' +
        z(d.getDate())    + '_' +
        z(d.getHours())   + '-' + 
        z(d.getMinutes()) + '-' +
        z(d.getSeconds()) + '-' +
        zz(d.getMilliseconds())
            
    return `ScreenRecord_${d}.${fileExtension}`
} // END function makeFileName