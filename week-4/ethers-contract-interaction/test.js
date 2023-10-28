const { assert } = require('chai');
const {getValue, setValue, transfer} = require('./index');

describe('Contract', function () {
    const random = Math.floor(Math.random() * 1000);
    let contract;
    before(async () => {
        const Contract = await ethers.getContractFactory("Contract");
        contract = await Contract.deploy(random);
        await contract.deployed();
    });

    it('should get the value', async () => {
        const value = await getValue(contract);
        assert.equal(value, random);
    });

    it('should set the value', async () => {
        await setValue(contract);
        const value = await contract.value();
        assert(value.gt(0), "Expecting value to be modified. Still set at 0!");
    });
});

describe('Token', function () {
    let contract;
    let owner;
    let friend;
    before(async () => {
        const accounts = await ethers.provider.listAccounts();
        owner = accounts[1];
        friend = accounts[2];
        
        const Contract = await ethers.getContractFactory("Token");
        contract = await Contract.deploy();
        await contract.deployed();
    });

    describe('after transfer', () => {
        before(async () => {
            await transfer(contract, friend);
        });

        it('should decrease the owner balance', async () => {
            const balance = await contract.balances(owner);
            assert(balance.lt(1000));
        });

        it('should increase the friend balance', async () => {
            const balance = await contract.balances(friend);
            assert(balance.gt(0));
        });
    });
});

describe('ContractMsg', function () {
    let contract;
    before(async () => {
        const Contract = await ethers.getContractFactory("ContractMsg");
        contract = await Contract.deploy();
        await contract.deployed();
    });

    it('should set the value', async () => {
        await setMessage(contract, ethers.provider.getSigner(1));
        const message = await contract.message();
        assert.notEqual(message, "", "Expecting message to be modified. Still set to an empty string!");
    });
});

describe('ContractDeposit', function () {
    let contract;
    before(async () => {
        const Contract = await ethers.getContractFactory("ContractDeposit");
        contract = await Contract.deploy();
        await contract.deployed();
    });

    it('should deposit at least 1 ether', async () => {
        await deposit(contract);
        const balance = await ethers.provider.getBalance(contract.address);
        assert(balance.gte(ethers.utils.parseEther("1")));
    });
});