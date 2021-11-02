function formatBytes(bytes, decimals = 2, k = 1024) {
    if (bytes == 0) return "0 Bytes"

    let sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    let d = Math.floor(Math.log(bytes) / Math.log(k))
    let c = parseFloat((bytes / Math.pow(k, d)).toFixed(Math.max(0, decimals)))

    return `${c} ${sizes[d]}`
} // END function formatBytes


function makeFileName(fileExtension) {
    var z  = n =>  ('0' + n).slice(-2)
    var zz = n => ('00' + n).slice(-3)

    var d = new Date()

    var off = d.getTimezoneOffset()

    var sign = off > 0? '-' : '+'
    off = Math.abs(off)

    d = d.getFullYear() + '-' +
        z(d.getMonth()+1) + '-' +
        z(d.getDate()) + '_' +
        z(d.getHours()) + '-'  + 
        z(d.getMinutes()) + '-' +
        z(d.getSeconds()) + '-' +
        zz(d.getMilliseconds())
            
    return `ScreenRecord_${d}.${fileExtension}`
} // END function makeFileName