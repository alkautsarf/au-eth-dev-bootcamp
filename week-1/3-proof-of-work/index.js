const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;

const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    // TODO: add transaction to mempool
    mempool.push(transaction);
}

function mine() {
    // TODO: mine a block
    const id = blocks.length;
    const transactions = mempool.filter((el, idx) => idx < MAX_TRANSACTIONS)
    const block = {id, transactions};
    if(mempool.length > MAX_TRANSACTIONS) mempool.splice(0, MAX_TRANSACTIONS)
    else mempool.splice(0, mempool.length)
    const hashedBlock = SHA256(JSON.stringify(block));
    block.nonce = 0;
    let hash
    while (true) {
        hash = SHA256(JSON.stringify(block)).toString()
        if (BigInt(`0x${hash}`) < TARGET_DIFFICULTY) {
            break;
        }
        block.nonce++;
    }
    blocks.push({...block, hash});
}

module.exports = {
    TARGET_DIFFICULTY,
    MAX_TRANSACTIONS,
    addTransaction, 
    mine, 
    blocks,
    mempool
};