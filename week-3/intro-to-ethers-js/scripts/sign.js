const ethers = require('ethers');
const { Wallet } = ethers;
const { wallet1 } = require('./wallets');

// TODO: replace all undefined values

const signaturePromise = wallet1.signTransaction({
    value: ethers.parseEther("1.0"),
    to: "0xdD0DC6FB59E100ee4fA9900c2088053bBe14DE92", 
    gasLimit: ethers.toBeHex("21000"), //encoded from 21000
});

module.exports = signaturePromise;