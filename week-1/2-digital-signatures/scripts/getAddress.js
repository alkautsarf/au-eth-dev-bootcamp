const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

function getAddress(publicKey) {
    let result = keccak256(publicKey.slice(1))
    return result.slice(-20)
}

module.exports = getAddress;