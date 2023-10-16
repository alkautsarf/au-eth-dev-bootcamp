const axios = require('axios');
require('dotenv').config();

// copy-paste your URL provided in your Alchemy.com dashboard
const ALCHEMY_URL = process.env.ALCHEMY_URL

axios.post(ALCHEMY_URL, {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_getBlockByNumber",
  params: [
    "0xb443", // block 46147
    false  // retrieve the full transaction object in transactions array
  ]
}).then((response) => {
  console.log(response.data.result);
});

// my own script

// Setup: npm install @alch/alchemy-sdk
const { Network, Alchemy } = require("alchemy-sdk");

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.ALCHEMY_API, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

async function checkLatestBlock() {
  const latestBlock = await alchemy.core.getBlockNumber();
  console.log("The latest block number is", latestBlock);
}
const checkBalance = async () => {
    const balanceInHex = await alchemy.core.getBalance("vitalik.eth", "latest")
    const balance = (parseInt(balanceInHex) / 10 ** 18).toFixed(2)
    console.log(`${balance} ETH`)

}

checkLatestBlock();
checkBalance();