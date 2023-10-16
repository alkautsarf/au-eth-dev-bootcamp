require('dotenv').config();
const { API_KEY } = process.env;
const axios = require('axios');
const url = `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`;

async function getTotalBalance(addresses) {
    const batch = [
        // TODO: fill in with several JSON RPC requests
    ];
    addresses.forEach((el, idx) => {
        batch.push({
            id: idx + 1,
            jsonrpc: '2.0',
            params: [el, 'latest'],
            method: 'eth_getBalance'
        })
    })

    const {data} = await axios.post(url, batch);

    // use this if you want to inspect the response data!
    // console.log(data);

    // return the total balance of all the addresses 
    const totalBalances = data.reduce((acc, curr) => {
        return acc + parseInt(curr.result)
    }, 0)

    return totalBalances;
    
}

module.exports = getTotalBalance;