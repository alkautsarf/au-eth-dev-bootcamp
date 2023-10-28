const { assert } = require('chai');
describe('Contract', function () {
    let contract;
    before(async () => {
        const Contract = await ethers.getContractFactory("Contract");
        contract = await Contract.deploy();
        await contract.deployed();
    });
    //Bool
    it('should create variable a: true', async () => {
        const a = await contract.callStatic.a();
        assert.equal(a, true);
    });

    it('should create variable b: false', async () => {
        const b = await contract.callStatic.b();
        assert.equal(b, false);
    });
    // Uint
    it('should create variable a which is less than 256', async () => {
        const a = await contract.callStatic.a();
        assert.isAtMost(a, 255);
    });

    it('should create variable b which is greater than or equal to 256', async () => {
        const b = await contract.callStatic.b();
        assert.isAtLeast(b, 256);
    });

    it('should create variable sum which equals a and b together', async () => {
        const a = await contract.callStatic.a();
        const b = await contract.callStatic.b();
        const sum = await contract.callStatic.sum();
        assert.equal(sum.toNumber(), a + b);
    });
    //Int
    it('should create two variables, one positive and one negative', async () => {
        const a = await contract.callStatic.a();
        const b = await contract.callStatic.b();
        const aPositive = a > 0 && b < 0;
        const bPositive = b > 0 && a < 0;
        assert(aPositive || bPositive, "Declare variables a and b where one is positive (above zero) and the other is negative (below zero)");
    });

    it('should find the absolute difference between the two variables', async () => {
        const a = await contract.callStatic.a();
        const b = await contract.callStatic.b();
        const difference = await contract.callStatic.difference();
        assert.equal(difference, Math.abs(a - b));
    });
    //String
    it('should create a msg1 as bytes32 with hello world', async () => {
        const msg1 = await contract.callStatic.msg1();
        const ascii = ethers.utils.parseBytes32String(msg1);
        assert(/hello world/i.test(ascii), "Could not find 'Hello World' in your msg1!");
    });

    it('should create a msg2 as string which requires more than 32 bytes', async () => {
        const msg2 = await contract.callStatic.msg2();
        assert.isAtLeast(Buffer.byteLength(msg2, 'utf8'), 32);
    });
    //Enum
    it('should create four foods', async () => {
        for(let i = 1; i <= 4; i++) {
            const food = await contract.callStatic[`food${i}`]();
            assert.isAtLeast(food, 0);
        }
    });
});