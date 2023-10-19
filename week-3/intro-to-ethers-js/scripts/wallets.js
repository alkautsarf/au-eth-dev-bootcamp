const ethers = require('ethers');
const { Wallet } = ethers;

// create a wallet with a private key
const wallet1 = new Wallet("0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d");

// create a wallet from mnemonic
const wallet2 = ethers.Wallet.fromPhrase("plate lawn minor crouch bubble evidence palace fringe bamboo laptop dutch ice");

// const wallet2 = hdnode.derivePath('m/44\'/60\'/0\'/0/0');
// const wallet2 = Wallet.fromMnemonic();

module.exports = {
    wallet1,
    wallet2,
}