const { Wallet, utils, providers, BrowserProvider } = require('ethers');
const { ganacheProvider, PRIVATE_KEY } = require('../config');

// TODO: replace undefined with a new web3 provider
const provider = new BrowserProvider(ganacheProvider, 1337);

const wallet = new Wallet(PRIVATE_KEY); 

async function sendEther({ value, to }) {
    const tx = await wallet.sendTransaction({ 
        value, to, 
        gasLimit: 0x5208,
        gasPrice: 0x3b9aca00 
    });

    // TODO: send the transaction and return the transaction promise
    return tx

}

module.exports = sendEther;