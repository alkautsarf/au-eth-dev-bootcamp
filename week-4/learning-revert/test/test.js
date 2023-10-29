const { assert } = require('chai');
describe('Contract', function () {
    it('should not create a contract with a .5 ether deposit', async () => {
        let ex;
        try {
            const Contract = await ethers.getContractFactory("Contract");
            const contract = await Contract.deploy({ value: ethers.utils.parseEther(".5") });
            await contract.deployed();
        }
        catch (_ex) { ex = _ex; }
        if (!ex) {
            assert.fail("Contract was created with a .5 ether deposit");
        }
    });

    it('should create a contract with a 1 ether deposit', async () => {
        const Contract = await ethers.getContractFactory("Contract");
        const contract = await Contract.deploy({ value: ethers.utils.parseEther("1") });
        await contract.deployed();
    });

    it('should create a contract with a 2 ether deposit', async () => {
        const Contract = await ethers.getContractFactory("Contract");
        const contract = await Contract.deploy({ value: ethers.utils.parseEther("2") });
        await contract.deployed();
    });
});

describe('ContractModifier', function () {
    let contract;
    before(async () => {
        const Contract = await ethers.getContractFactory("ContractModifier");
        contract = await Contract.deploy();
        await contract.deployed();
    });

    it('should fail when another account attempts to set a config variable', async () => {
        const vals = ['A', 'B', 'C'];
        const other = ethers.provider.getSigner(1);
        for (let i = 0; i < vals.length; i++) {
            const val = vals[i];
            const methodName = `set${val}`;
            let ex;
            try {
                await contract.connect(other)[methodName](1);
            }
            catch (_ex) { ex = _ex; }
            if (!ex) {
                assert.fail(`Call to ${methodName} with non-owner did not fail!`);
            }
        }
    });

    it('should not fail when owner attempts to set a config variable', async () => {
        const vals = ['A', 'B', 'C'];
        for (let i = 0; i < vals.length; i++) {
            const val = vals[i];
            const methodName = `set${val}`;
            await contract[methodName](1);
        }
    });
});