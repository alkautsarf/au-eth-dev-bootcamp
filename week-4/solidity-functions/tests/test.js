const { assert } = require('chai');
const num = Math.floor(Math.random() * 1000); 
describe('Contract', function () {
    let contract;
    before(async () => {
        const Contract = await ethers.getContractFactory("Contract");
        contract = await Contract.deploy(num);
        await contract.deployed();
    });
    //Arguments
    it('should create variable x with the number stored in it', async () => {
        const x = await contract.callStatic.x();
        assert.equal(x, num);
    });
    //Increment
    it('should set the initial value to 0', async () => {
        const x = await contract.callStatic.x();
        assert.equal(x.toNumber(), 0);
    });

    describe('after one increment call', () => {
        before(async () => {
            await contract.increment();
        });

        it('should increase the value to 1', async () => {
            const x = await contract.callStatic.x();
            assert.equal(x.toNumber(), 1);
        });
    });

    describe('after a second increment call', () => {
        before(async () => {
            await contract.increment();
        });

        it('should increase the value to 2', async () => {
            const x = await contract.callStatic.x();
            assert.equal(x.toNumber(), 2);
        });
    });
    //View Addition
    describe('Contract: add function', function () {
        [[1, 3], [2, 4], [3, 7]].forEach(([x, y]) => {
            const expectedSum = x + y;
            describe(`when the contract is deployed with ${x}`, () => {
                let contract;
                before(async () => {
                    const Contract = await ethers.getContractFactory("Contract");
                    contract = await Contract.deploy(x);
                    await contract.deployed();
                });
                it(`it should add ${y} to get ${expectedSum}`, async () => { 
                    const sum = await contract.callStatic.add(y);
                    assert.equal(sum.toNumber(), expectedSum);
                });
            });
        });
    });
    //Pure Double
    describe('Contract: double function', function () {
        let contract;
        before(async () => {
            const Contract = await ethers.getContractFactory("Contract");
            contract = await Contract.deploy();
            await contract.deployed();
        });
    
        [1, 4, 7].forEach((x) => {
            const expected = x * 2;
            describe(`when the number is ${x}`, () => {
                it(`should double it to get ${expected}`, async () => {
                    const doubled = await contract.callStatic.double(x);
                    assert.equal(doubled.toNumber(), expected);
                });
            });
        });
    });
    //Double Overload
    describe('Contract: double function', function () {
        let contract;
        before(async () => {
            const Contract = await ethers.getContractFactory("Contract");
            contract = await Contract.deploy();
            await contract.deployed();
        });
    
        [[1, 3], [2, 4], [3, 7]].forEach(([x, y]) => {
            const [x2, y2] = [x * 2, y * 2];
            describe(`when the numbers are ${x} and ${y}`, () => {
                it(`should double them to get ${x2} and ${y2}`, async () => {
                    const result = await contract.callStatic["double(uint256,uint256)"](x,y);
                    assert.equal(result[0], x2);
                    assert.equal(result[1], y2);
                });
            });
        });
    });
});

