export function brightnessByColor(color) {
    // doesn't work when selecting from prop panel?
    // For some reason, Framer uses HSL and RGB. Fix brightnessByColor to use HSL
    let r, b, g
    let colors = "" + color,
        isHEX = color.indexOf("#") == 0,
        isRGB = color.indexOf("rgb") == 0
    if (isHEX) {
        let m = color
            .substr(1)
            .match(color.length == 7 ? /(\S{2})/g : /(\S{1})/g)
        if (m) {
            r = parseInt(m[0], 16)
            g = parseInt(m[1], 16)
            b = parseInt(m[2], 16)
        }
    }
    if (isRGB) {
        let m = color.match(/(\d+){3}/g)
        if (m) {
            r = m[0]
            g = m[1]
            b = m[2]
        }
    }
    if (typeof r != "undefined") return (r * 299 + g * 587 + b * 114) / 1000
}

export function hexToCMYK(hex) {
    var computedC = 0
    var computedM = 0
    var computedY = 0
    var computedK = 0

    hex = hex.charAt(0) == "#" ? hex.substring(1, 7) : hex

    if (hex.length != 6) {
        alert("Invalid length of the input hex value!")
        return
    }
    if (/[0-9a-f]{6}/i.test(hex) != true) {
        alert("Invalid digits in the input hex value!")
        return
    }

    var r = parseInt(hex.substring(0, 2), 16)
    var g = parseInt(hex.substring(2, 4), 16)
    var b = parseInt(hex.substring(4, 6), 16)

    // BLACK
    if (r == 0 && g == 0 && b == 0) {
        computedK = 1
        return [0, 0, 0, 1]
    }

    computedC = 1 - r / 255
    computedM = 1 - g / 255
    computedY = 1 - b / 255

    var minCMY = Math.min(computedC, Math.min(computedM, computedY))

    computedC = (computedC - minCMY) / (1 - minCMY)
    computedM = (computedM - minCMY) / (1 - minCMY)
    computedY = (computedY - minCMY) / (1 - minCMY)
    computedK = minCMY

    const dc = Math.floor(parseFloat(computedC.toFixed(2)) * 100)
    const dm = Math.floor(parseFloat(computedM.toFixed(2)) * 100)
    const dy = Math.floor(parseFloat(computedY.toFixed(2)) * 100)
    const dk = Math.floor(parseFloat(computedK.toFixed(2)) * 100)

    return `CMYK(${dc}%, ${dm}%, ${dy}%, ${dk}%)`
}
