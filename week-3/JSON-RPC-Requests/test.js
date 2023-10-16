const { assert, util: { inspect }} = require('chai');
const getBlockNumber = require('./getBlockNumber');
const getBalance = require('./getBalance');
const getNonce = require('./getNonce')
const getTotalTransactions = require('./getBlockTransactions');
const getTotalBalance = require('./getTotalBalances');

const addresses = [
    '0x830389b854770e9102eb957379c6b70da4283d60',
    '0xef0613ab211cfb5eeb5a160b65303d6e927f3f85',
    '0x5311fce951684e46cefd804704a06c5133030dff',
    '0xe01c0bdc8f2a8a6220a4bed665ceeb1d2c716bcb',
    '0xf6c68965cdc903164284b482ef5dfdb640d9e0de'
];

describe('json-rpc-requests', function () {
    this.timeout(10000)
    describe('getBlockNumber', function () {
        it('should get the current block number', function (done) { // add done as a parameter
            getBlockNumber()
                .then(blockNumber => {
                    const parsed = parseInt(blockNumber);
                    assert(!isNaN(parsed), `We expected you to return a block number, here is what you returned: ${inspect(blockNumber)}`);
                    assert.isAbove(parsed, 0xfde2cf);
                    done(); // call done when all promises are resolved
                })
                .catch(error => done(error)); // call done with an error if any promise rejects
        });
    });

    describe('getBalance', function () {
        it('should find the balance of the address with 10 ether', function (done) { // add done as a parameter
            getBalance("0x3bfc20f0b9afcace800d73d2191166ff16540258")
                .then(balance => {
                    const parsed = parseInt(balance);
                    assert(!isNaN(parsed), `We expected you to return a balance, here is what you returned: ${inspect(balance)}`);
                    assert.isAbove(parsed, 0x40db451e4e74a0311e90);
                    done(); // call done when all promises are resolved
                })
                .catch(error => done(error)); // call done with an error if any promise rejects
        });
    });

    describe('getNonce', function () {
        it('should get the nonce for an address', function (done) { // add done as a parameter
            getNonce("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
                .then(nonce => {
                    const parsed = parseInt(nonce);
                    assert(!isNaN(parsed), `We expected you to return a nonce, here is what you returned: ${inspect(nonce)}`);
                    assert.isAbove(parsed, 1015);
                    done(); // call done when all promises are resolved
                })
                .catch(error => done(error)); // call done with an error if any promise rejects
        });
    });

    describe('getTotalTransactions', () => {
        it('should work for an empty block', function (done) { // add done as a parameter
            getTotalTransactions('0x' + (12379).toString(16))
                .then(numTx => {
                    const parsed = parseInt(numTx);
                    assert(!isNaN(parsed), `We expected you to return a transactions count, here is what you returned: ${inspect(numTx)}`);
                    assert.equal(parsed, 0);
                    done(); // call done when all promises are resolved
                })
                .catch(error => done(error)); // call done with an error if any promise rejects
        });

        it('should work for a recent block', function (done) { // add done as a parameter
            getTotalTransactions('0x' + (16642379).toString(16))
                .then(numTx => {
                    const parsed = parseInt(numTx);
                    assert(!isNaN(parsed), `We expected you to return a transactions count, here is what you returned: ${inspect(numTx)}`);
                    assert.equal(parsed, 206);
                    done(); // call done when all promises are resolved
                })
                .catch(error => done(error)); // call done with an error if any promise rejects
        });
    });

    describe('getTotalBalance', () => {
        it('should find the total balance of all the addresses', async () => {
            const totalBalance = await getTotalBalance(addresses);
            const parsed = parseInt(totalBalance);
            assert(!isNaN(parsed), `We expected you to return a total balance, here is what you returned: ${inspect(totalBalance)}`);
            assert.isAtLeast(parsed, 250000000000000000);
        });
    });
});


// describe('json-rpc-requests', function () {
//     this.timeout(10000)
//     describe('getBlockNumber', function () {
//         it('should get the current block number', function (done) { // add done as a parameter
//             getBlockNumber()
//                 .then(blockNumber => {
//                     const parsed = parseInt(blockNumber);
//                     assert(!isNaN(parsed), `We expected you to return a block number, here is what you returned: ${inspect(blockNumber)}`);
//                     assert.isAbove(parsed, 0xfde2cf);
//                     done(); // call done when all promises are resolved
//                 })
//                 .catch(error => done(error)); // call done with an error if any promise rejects
//         });
//     });

//     describe('getBalance', function () {
//         it('should find the balance of the address with 10 ether', function (done) { // add done as a parameter
//             getBalance("0x3bfc20f0b9afcace800d73d2191166ff16540258")
//                 .then(balance => {
//                     const parsed = parseInt(balance);
//                     assert(!isNaN(parsed), `We expected you to return a balance, here is what you returned: ${inspect(balance)}`);
//                     assert.isAbove(parsed, 0x40db451e4e74a0311e90);
//                     done(); // call done when all promises are resolved
//                 })
//                 .catch(error => done(error)); // call done with an error if any promise rejects
//         });
//     });

//     describe('getNonce', function () {
//         it('should get the nonce for an address', function (done) { // add done as a parameter
//             getNonce("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
//                 .then(nonce => {
//                     const parsed = parseInt(nonce);
//                     assert(!isNaN(parsed), `We expected you to return a nonce, here is what you returned: ${inspect(nonce)}`);
//                     assert.isAbove(parsed, 1015);
//                     done(); // call done when all promises are resolved
//                 })
//                 .catch(error => done(error)); // call done with an error if any promise rejects
//         });
//     });

//     describe('getTotalTransactions', () => {
//         it('should work for an empty block', async () => {
//             const numTx = await getTotalTransactions('0x' + (12379).toString(16));
//             const parsed = parseInt(numTx);
//             assert(!isNaN(parsed), `We expected you to return a transactions count, here is what you returned: ${inspect(numTx)}`);
//             assert.equal(parsed, 0);
//         });
    
//         it('should work for a recent block', async () => {
//             const numTx = await getTotalTransactions('0x' + (16642379).toString(16));
//             const parsed = parseInt(numTx);
//             assert(!isNaN(parsed), `We expected you to return a transactions count, here is what you returned: ${inspect(numTx)}`);
//             assert.equal(parsed, 206);
//         });
//     });
// });


