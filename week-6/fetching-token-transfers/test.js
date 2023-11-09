const { assert } = require('chai');
const totalDaiTransferred = require('./totalDaiTransferred');
const totalErc20Transfers = require('./');

describe('totalDaiTransferred', () => {
    it('should work for a block interval containing 9 transfers', async () => {
        const daiTransferred = await totalDaiTransferred("0xff26e1", "0xff2eb0");
        assert.equal(daiTransferred, 40002218271580000000000n);
    });

    it('should work for a block interval containing 2335 transfers', async () => {
        const daiTransferred = await totalDaiTransferred("0xfa26e1", "0xff2eb0");
        assert.equal(daiTransferred, 228084566470652280000000000n);
    }).timeout(100000);
});

describe('totalErc20Transfers', () => {
    it('should work for a block interval containing 184 ERC20 transfers', async () => {
        const total = await totalErc20Transfers("0xff2db0", "0xff2eb0");
        assert.equal(total, 184);
    });

    it('should work for a block interval containing 572 transfers', async () => {
        const total = await totalErc20Transfers("0xff2ab0", "0xff2eb0");
        assert.equal(total, 572);
    }).timeout(100000);
});