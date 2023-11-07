const {assert} = require('chai');
const fs = require('fs');

describe('MultiSig', function () {
    let contract;
    let _required = 2;
    before(async () => {
        accounts = await ethers.provider.listAccounts();
        const MultiSig = await ethers.getContractFactory("MultiSig");
        contract = await MultiSig.deploy(accounts.slice(0, 3), _required);
        await contract.deployed();
    });

    it('should set an array of owners', async function () {
        let firstOwner = await contract.callStatic.owners(0);
        let lastOwner = await contract.callStatic.owners(2);
        assert.equal(accounts[2], lastOwner);
        assert.equal(accounts[0], firstOwner);
    });

    it('should set the number of required confirmations', async function () {
        const required = await contract.required();
        assert.equal(_required, required);
    });
});

describe('MultiSig', function () {
  let contract;
  let accounts;
  let MultiSig;
  before(async () => {
      MultiSig = await ethers.getContractFactory("MultiSig");
      accounts = await ethers.provider.listAccounts();
  });

  describe('for a valid multisig', () => {
      let _required = 2;
      before(async () => {
          contract = await MultiSig.deploy(accounts.slice(0, 3), _required);
          await contract.deployed();
      });

      it('should set an array of owners', async () => {
          let firstOwner = await contract.callStatic.owners(0);
          let lastOwner = await contract.callStatic.owners(2);
          assert.equal(accounts[2], lastOwner);
          assert.equal(accounts[0], firstOwner);
      });

      it('should set required confirmations', async () => {
          let required = await contract.callStatic.required();
          assert.equal(_required, required.toNumber());
      });
  });

  describe('for a multisig with no owners', () => {
      it('should revert', async () => {
          await expectThrow(MultiSig.deploy([], 1));
      });
  });

  describe('for a multisig with no required confirmations', () => {
      it('should revert', async () => {
          await expectThrow(MultiSig.deploy(accounts.slice(0,3), 0));
      });
  });

  describe('for a multisig with more required confirmations than owners', () => {
      it('should revert', async () => {
          await expectThrow(MultiSig.deploy(accounts.slice(0,3), 4));
      });
  });
});

async function expectThrow(promise) {
  const errMsg = 'Expected throw not received';
  try {
      await promise;
  } catch (err) {
      return;
  }
  assert(false, errMsg);
}

const errors = [
  "Make sure to declare a public uint for the transaction count!",
  "Make sure to declare a public mapping for the transactions!",
];
const jsonLoc = "./artifacts/contracts/Multisig.sol/MultiSig.json";
const { abi } = JSON.parse(fs.readFileSync(jsonLoc).toString());
describe('MultiSig', function () {
  it('should define the transaction count', async function () {
      const transactionCount = abi.filter(x => x.name === 'transactionCount')[0];
      assert(transactionCount, errors[0]);
      assert.deepEqual(transactionCount.outputs.map(x => x.type), ['uint256']);
  });

  it('should define a transactions mapping or array', async function () {
      const transactions = abi.filter(x => x.name === 'transactions')[0];
      assert(transactions, errors[1]);
      assert.deepEqual(transactions.inputs.map(x => x.type), ['uint256']);
      assert.deepEqual(transactions.outputs.map(x => x.type), ['address', 'uint256', 'bool']);
  });
});

describe('MultiSig', function () {
  let contract;
  let accounts;
  let zero = ethers.constants.AddressZero;
  let _required = 2;

  describe('Add Transaction Tests', function () {
      beforeEach(async () => {
          accounts = await ethers.provider.listAccounts();
          const MultiSig = await ethers.getContractFactory("MultiSig");
          contract = await MultiSig.deploy(accounts.slice(0,3), _required);
          await contract.deployed();
      });

      it('should create a new Transaction', async function () {
          await contract.addTransaction(accounts[1], 100);

          let tx = await contract.callStatic.transactions;
          let address = tx[0];
          assert.notEqual(address, zero);
      });

      it('should keep count of the amount of transactions', async function () {
          await contract.addTransaction(accounts[1], 100);

          let txCount = await contract.callStatic.transactionCount();
          assert.equal(txCount.toNumber(), 1);
      });

      it('should return a transaction id', async function () {
          await contract.addTransaction(accounts[1], 100);

          let txId = await contract.callStatic.addTransaction(accounts[1], 100);

          assert.equal(txId.toNumber(), 1);
      });
  });
});

const error = "Make sure to declare a public uint for the confirmations!";
describe('MultiSig', function () {
    it('should define a confirmations mapping', async function () {
        const confirmations = abi.filter(x => x.name === 'confirmations')[0];
        assert(confirmations, error);
        assert.deepEqual(confirmations.inputs.map(x => x.type), ['uint256', 'address']);
        assert.deepEqual(confirmations.outputs.map(x => x.type), ['bool']);
    });
});

describe('MultiSig', function () {
  let contract;
  let accounts;
  let _required = 2;
  beforeEach(async () => {
      accounts = await ethers.provider.listAccounts();
      const MultiSig = await ethers.getContractFactory("MultiSig");
      contract = await MultiSig.deploy(accounts.slice(0, 3), _required);
      await contract.deployed();
  });

  describe('after creating the first transaction', function () {
      beforeEach(async () => {
          await contract.addTransaction(accounts[1], 100);
          await contract.confirmTransaction(0);
      });

      it('should confirm the transaction', async function () {
          let confirmed = await contract.callStatic.getConfirmationsCount(0);
          assert.equal(confirmed, 1);
      });

      describe('after creating the second transaction', function () {
          beforeEach(async () => {
              await contract.addTransaction(accounts[1], 100);
              await contract.confirmTransaction(1);
              await contract.connect(ethers.provider.getSigner(accounts[1])).confirmTransaction(1);
          });

          it('should confirm the transaction twice', async function () {
              let confirmed = await contract.callStatic.getConfirmationsCount(1);
              assert.equal(confirmed, 2);
          });
      });
  });
});

describe('MultiSig', function () {
  let contract;
  let accounts;
  let _required = 2;
  before(async () => {
      accounts = await ethers.provider.listAccounts();
      const MultiSig = await ethers.getContractFactory("MultiSig");
      contract = await MultiSig.deploy(accounts.slice(0, 3), _required);
      await contract.deployed();
  });

  describe('Confirm Transaction Tests', function () {
      beforeEach(async () => {
          await contract.addTransaction(accounts[1], 100);
      });

      describe('from an invalid address', () => {
          it('should throw an error', async function () {
              await expectThrow(
                  contract.connect(ethers.provider.getSigner(accounts[3])).confirmTransaction(0)
              );
          });
      });

      describe('from a valid owner address', () => {
          it('should not throw an error', async function () {
              await contract.connect(ethers.provider.getSigner(accounts[2])).confirmTransaction(0);
              assert(true);
          });
      });
  });
});

async function expectThrow(promise) {
  const errMsg = 'Expected throw not received';
  try {
      await promise;
  } catch (err) {
      return;
  }
  assert(false, errMsg);
}

describe('MultiSig', function () {
  let contract;
  let accounts;
  let zero = ethers.constants.AddressZero;
  let _required = 2;

  describe('Submit Transaction Tests', function () {
      beforeEach(async () => {
          accounts = await ethers.provider.listAccounts();
          const MultiSig = await ethers.getContractFactory("MultiSig");
          contract = await MultiSig.deploy(accounts.slice(0, 3), _required);
          await contract.deployed();
      });

      it('should add a transaction', async function () {
          await contract.submitTransaction(accounts[1], 100);
          let tx = await contract.callStatic.transactions(0);
          let address = tx[0];
          assert.notEqual(address, zero);
      });

      it('should confirm a transaction', async function () {
          await contract.submitTransaction(accounts[1], 100);

          let confirmed = await contract.callStatic.getConfirmationsCount(0);
          assert.equal(confirmed, 1);
      });

      it('should not call addTransaction externally', async function () {
          assert.equal(contract.addTransaction, undefined, "Did not expect addTransaction to be defined publicly!");
      });
  });
});

describe('MultiSig', function () {
  let contract;
  let accounts;
  let _required = 2;
  describe('Fallback Tests', function () {
      beforeEach(async () => {
          accounts = await ethers.provider.listAccounts();
          const MultiSig = await ethers.getContractFactory("MultiSig");
          contract = await MultiSig.deploy(accounts.slice(0, 3), _required);
          await contract.deployed();
      });

      it('should accept funds', async function () {
          const value = ethers.utils.parseEther("1");
          await ethers.provider.getSigner(accounts[1]).sendTransaction({ to: contract.address, value });
          const balance = await ethers.provider.getBalance(contract.address);
          assert.equal(balance.toString(), value.toString());
      });
  });
});

describe('MultiSig', function () {
  let contract;
  let accounts;
  let _required = 2;

  describe('Confirmed Tests', function () {
      beforeEach(async () => {
          accounts = await ethers.provider.listAccounts();
          const MultiSig = await ethers.getContractFactory("MultiSig");
          contract = await MultiSig.deploy(accounts.slice(0, 3), _required);
          await contract.deployed();
      });

      it('should return true if the required threshold is met for a transaction', async function () {
          await contract.submitTransaction(accounts[1], 100);

          await contract.connect(ethers.provider.getSigner(accounts[1])).confirmTransaction(0);
          const confirmed = await contract.callStatic.isConfirmed(0);

          assert.equal(confirmed, true);
      });

      it('should return false if the required threshold is not met for a transaction', async function () {
          await contract.submitTransaction(accounts[1], 100);

          let confirmed = await contract.callStatic.isConfirmed(0);

          assert.equal(confirmed, false);
      });
  });
});

describe('MultiSig', function () {
  let contract;
  let accounts, signer1;
  let _required = 2;
  describe('Execute Transaction Tests', function () {
      beforeEach(async () => {
          accounts = await ethers.provider.listAccounts();
          const MultiSig = await ethers.getContractFactory("MultiSig");
          contract = await MultiSig.deploy(accounts.slice(0, 3), _required);
          await contract.deployed();
          signer1 = ethers.provider.getSigner(accounts[1]);
      });

      it('should execute a transaction if confirmation threshold is met', async function () {
          const value = ethers.utils.parseEther("1");
          await signer1.sendTransaction({ to: contract.address, value });
          await contract.submitTransaction(accounts[1], ethers.utils.parseEther(".5"));

          await contract.connect(signer1).confirmTransaction(0);
          await contract.connect(signer1).executeTransaction(0);
          let txn = await contract.callStatic.transactions(0);
          assert.equal(txn[2], true, "Expected `executed` bool to be true!");
      });

      it('should not execute a transaction if confirmation threshold is not met', async function () {
          const value = ethers.utils.parseEther("1");
          await signer1.sendTransaction({ to: contract.address, value });
          await contract.submitTransaction(accounts[1], ethers.utils.parseEther(".5"));
      
          await expectThrow(contract.executeTransaction(0));
      });

      it('should transfer funds to the beneficiary', async function () {
          const value = ethers.utils.parseEther("1");
          const transferValue = ethers.utils.parseEther(".5");
          const recipient = accounts[2];

          const balanceBefore = await ethers.provider.getBalance(recipient);
          const contractBalanceBefore = await ethers.provider.getBalance(contract.address);

          await signer1.sendTransaction({ to: contract.address, value });
          await contract.submitTransaction(recipient, transferValue);
          await contract.connect(signer1).confirmTransaction(0);
          await contract.connect(signer1).executeTransaction(0);

          const balanceAfter = await ethers.provider.getBalance(recipient);
          const contractBalanceAfter = await ethers.provider.getBalance(contract.address);

          assert.equal(balanceAfter.sub(balanceBefore).toString(), transferValue.toString());
          assert.equal(contractBalanceAfter.sub(contractBalanceBefore).toString(), transferValue.toString());
      });

      it('should only allow valid owners to execute', async function () {
          const value = ethers.utils.parseEther("1");
          const transferValue = ethers.utils.parseEther(".5");
          await signer1.sendTransaction({ to: contract.address, value });
          await contract.submitTransaction(accounts[1], transferValue);
          await expectThrow(
              contract.connect(ethers.provider.getSigner(6)).executeTransaction(0)
          );
      });
  });
});

async function expectThrow(promise) {
  try {
      await promise;
  } catch (err) {
      return;
  }
  assert(false, 'Expected the transaction to revert!');
}

describe('MultiSigFix', function () {
  let contract;
  let _required = 2;
  let accounts;
  let beforeBalance, signer1;
  beforeEach(async () => {
      accounts = await ethers.provider.listAccounts();
      const MultiSig = await ethers.getContractFactory("MultiSigFix");
      contract = await MultiSig.deploy(accounts.slice(0, 3), _required);
      await contract.deployed();

      signer1 = ethers.provider.getSigner(accounts[1]);
      beforeBalance = await ethers.provider.getBalance(accounts[2]);
  });

  describe("after depositing and submitting a transaction", () => {
      const transferAmount = ethers.utils.parseEther("0.5");
      beforeEach(async () => {
          await signer1.sendTransaction({ to: contract.address, value: transferAmount.mul(2) });
          await contract.submitTransaction(accounts[2], transferAmount);
      });

      it('should not execute transaction yet', async () => {
          const txn = await contract.callStatic.transactions(0);
          assert(!txn.executed);
      });

      it('should not update the beneficiary balance', async () => {
          const afterBalance = await ethers.provider.getBalance(accounts[2]);
          assert.equal(afterBalance.toString(), beforeBalance.toString());
      });

      describe('after confirming', () => {
          beforeEach(async () => {
              await contract.connect(signer1).confirmTransaction(0);
          });

          it('should try to execute transaction after confirming', async () => {
              const txn = await contract.callStatic.transactions(0);
              assert(txn.executed);
          });

          it('should update the beneficiary balance', async () => {
              const afterBalance = await ethers.provider.getBalance(accounts[2]);
              assert.equal(afterBalance.sub(beforeBalance).toString(), transferAmount.toString());
          });
      });
  });
});

describe('MultiSigComplete', function () {
  let contract;
  let accounts;
  beforeEach(async () => {
      accounts = await ethers.provider.listAccounts();
      const MultiSig = await ethers.getContractFactory("MultiSigComplete");
      contract = await MultiSig.deploy(accounts.slice(0, 3), 1);
      await contract.deployed();
  });

  describe('storing ERC20 tokens', function () {
      const initialBalance = 10000;
      let token;

      beforeEach(async () => {
          const EIP20 = await ethers.getContractFactory("EIP20");
          token = await EIP20.deploy(initialBalance, 'My Token', 1, 'MT');
          await token.deployed();
          await token.transfer(contract.address, initialBalance);
      });

      it('should store the balance', async () => {
          const balance = await token.balanceOf(contract.address);
          assert.equal(balance.toNumber(), initialBalance);
      });

      describe('executing an ERC20 transaction', function () {
          beforeEach(async () => {
              const data = token.interface.encodeFunctionData("transfer", [accounts[2], initialBalance]);
              await contract.submitTransaction(token.address, 0, data);
          });

          it('should have removed the contract balance', async () => {
              const balance = await token.balanceOf(contract.address);
              assert.equal(balance.toNumber(), 0);
          });

          it('should have moved the balance to the destination', async () => {
              const balance = await token.balanceOf(accounts[2]);
              assert.equal(balance.toNumber(), initialBalance);
          });
      });
  });

  describe('storing ether', function () {
      const oneEther = ethers.utils.parseEther("1");
      beforeEach(async () => {
          await ethers.provider.getSigner(0).sendTransaction({ to: contract.address, value: oneEther });
      });

      it('should store the balance', async () => {
          const balance = await ethers.provider.getBalance(contract.address);
          assert.equal(balance.toString(), oneEther.toString());
      });

      describe('executing the ether transaction', function () {
          let balanceBefore;

          beforeEach(async () => {
              balanceBefore = await ethers.provider.getBalance(accounts[1]);
              await contract.submitTransaction(accounts[1], oneEther, "0x");
          });

          it('should have removed the contract balance', async () => {
              const balance = await ethers.provider.getBalance(contract.address);
              assert.equal(balance, 0);
          });

          it('should have moved the balance to the destination', async () => {
              const balance = await ethers.provider.getBalance(accounts[1]);
              assert.equal(balance.sub(balanceBefore).toString(), oneEther.toString());
          });
      });
  });
});