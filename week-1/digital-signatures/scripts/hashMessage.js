const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

function hashMessage(message) {
    const result = keccak256(utf8ToBytes(message))
    return result
}

module.exports = hashMessage;