const { sha256 } = require("ethereum-cryptography/sha256");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

// the possible colors that the hash could represent
const COLORS = ['red', 'green', 'blue', 'yellow', 'pink', 'orange'];

// given a hash, return the color that created the hash
function findColor(hash) {
    let result = ''
    COLORS.forEach(el => {
        const bytes = utf8ToBytes(el)
        const hashed = sha256(bytes)
        if (toHex(hashed) == toHex(hash)) result = el
    })
    return result
}

module.exports = findColor;