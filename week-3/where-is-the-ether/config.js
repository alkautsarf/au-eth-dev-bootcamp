const ethers = require('ethers');
const Ganache = require("ganache");
const PRIVATE_KEY = "0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d";
const INITIAL_BALANCE = ethers.parseEther('10');

// create our test account from the private key, initialize it with 10 ether
const accounts = [].concat([{
    balance: ethers.toBeHex(INITIAL_BALANCE),
    secretKey: PRIVATE_KEY,
}]);

const ganacheProvider = Ganache.provider({ accounts });

module.exports = {
    INITIAL_BALANCE,
    PRIVATE_KEY,
    ganacheProvider,
}