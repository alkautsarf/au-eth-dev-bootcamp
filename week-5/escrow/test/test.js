const { assert } = require('chai');
const deposit = ethers.utils.parseEther("1");
const deploy = require('../scripts/deploy');
const approve = require('../scripts/approve');
const artifactLocation = "./artifacts/contracts/Escrow.sol/Escrow.json";


describe('Escrow', function () {
  let contract;
  let accounts = {};
  before(async () => {
    const roles = ['arbiter', 'beneficiary', 'depositor'];
    for (let i = 0; i < roles.length; i++) {
        const signer = ethers.provider.getSigner(i);
        const address = await signer.getAddress();
        accounts[roles[i]] = { signer, address }
    }

    const Contract = await ethers.getContractFactory("Escrow");
    contract = await Contract.connect(accounts.depositor.signer).deploy(
        accounts.arbiter.address,
        accounts.beneficiary.address,
        { value: deposit }
    );
    await contract.deployed();
});

  it('should be funded', async () => {
    let balance = await ethers.provider.getBalance(contract.address);
    assert.equal(balance.toString(), deposit.toString());
});

  it('should set an arbiter', async () => {
      const _arbiter = await contract.callStatic.arbiter();
      assert.equal(_arbiter, accounts.arbiter.address);
  });

  it('should set a depositor', async () => {
      const _depositor = await contract.callStatic.depositor();
      assert.equal(_depositor, accounts.depositor.address);
  });

  it('should set a beneficiary', async () => {
      const _beneficiary = await contract.callStatic.beneficiary();
      assert.equal(_beneficiary, accounts.beneficiary.address);
  });
});

describe('EscrowApproved', function () {
  let contract;
  let accounts = {};
  before(async () => {
      const roles = ['arbiter', 'beneficiary', 'depositor'];
      for (let i = 0; i < roles.length; i++) {
          const signer = ethers.provider.getSigner(i);
          const address = await signer.getAddress();
          accounts[roles[i]] = { signer, address }
      }

      const Contract = await ethers.getContractFactory("Escrow");
      contract = await Contract.connect(accounts.depositor.signer).deploy(
          accounts.arbiter.address,
          accounts.beneficiary.address,
          { value: deposit }
      );
      await contract.deployed();
  });

  it("should be funded", async () => {
      let balance = await ethers.provider.getBalance(contract.address);
      assert.equal(balance.toString(), deposit.toString());
  });

  describe("after approval", () => {
      let beforeBalance;
      before(async () => {
          beforeBalance = await ethers.provider.getBalance(accounts.beneficiary.address);
          await contract.connect(accounts.arbiter.signer).approve();
      });

      it("should transfer (using .call()) balance to beneficiary", async () => {
          const after = await ethers.provider.getBalance(accounts.beneficiary.address);
          assert.equal(after.sub(beforeBalance).toString(), deposit.toString());
      });

      it("should set the isApproved state to true", async () => {
          const isApproved = await contract.isApproved();
          assert(isApproved, "Expected isApproved to be true!");
      });
  });
});

describe('EscrowTransfer', function () {
  let contract;
  let accounts = {};
  before(async () => {
      const roles = ['arbiter', 'beneficiary', 'depositor'];
      for (let i = 0; i < roles.length; i++) {
          const signer = ethers.provider.getSigner(i);
          const address = await signer.getAddress();
          accounts[roles[i]] = { signer, address }
      }

      const Contract = await ethers.getContractFactory("Escrow");
      contract = await Contract.connect(accounts.depositor.signer).deploy(
          accounts.arbiter.address,
          accounts.beneficiary.address,
          { value: deposit }
      );
      await contract.deployed();
  });

  it("should be funded", async () => {
      let balance = await ethers.provider.getBalance(contract.address);
      assert.equal(balance.toString(), deposit.toString());
  });

  describe("after approval from address other than the arbiter", () => {
      it("should revert", async () => {
          let ex;
          try {
              await contract.connect(accounts.beneficiary.signer).approve();
          }
          catch (_ex) {
              ex = _ex;
          }
          assert(ex, "Attempted to approve the Escrow from the beneficiary address. Expected transaction to revert!");
      });
  });

  describe("after approval from the arbiter", () => {
      it("should transfer balance to beneficiary", async () => {
          const before = await ethers.provider.getBalance(accounts.beneficiary.address);
          await contract.connect(accounts.arbiter.signer).approve();
          const after = await ethers.provider.getBalance(accounts.beneficiary.address);
          assert.equal(after.sub(before).toString(), deposit.toString());
      });
  });
});

describe('EscrowEvent', function () {
  let contract;
  let accounts = {};
  beforeEach(async () => {
      const roles = ['arbiter', 'beneficiary', 'depositor'];
      for (let i = 0; i < roles.length; i++) {
          const signer = ethers.provider.getSigner(i);
          const address = await signer.getAddress();
          accounts[roles[i]] = { signer, address }
      }

      const Contract = await ethers.getContractFactory("Escrow");
      contract = await Contract.connect(accounts.depositor.signer).deploy(
          accounts.arbiter.address,
          accounts.beneficiary.address,
          { value: deposit }
      );
      await contract.deployed();
  });

  it("should be funded", async () => {
      let balance = await ethers.provider.getBalance(contract.address);
      assert.equal(balance.toString(), deposit.toString());
  });

  it("should default the isApproved state to false", async () => {
      const isApproved = await contract.isApproved();
      assert(!isApproved, "Expected isApproved to be false!");
  });

  describe("after approval from the arbiter", () => {
      let before;
      let receipt;
      beforeEach(async () => {
          before = await ethers.provider.getBalance(accounts.beneficiary.address);
          let tx = await contract.connect(accounts.arbiter.signer).approve();
          receipt = await tx.wait();
      });

      it("should transfer balance to beneficiary", async () => {
          const after = await ethers.provider.getBalance(accounts.beneficiary.address);
          assert.equal(after.sub(before).toString(), deposit.toString());
      });

      it("should emit the event", async () => {
          const event = receipt.events.find(x => x.event === "Approved");
          assert(event, "Expect an Approved event to be emitted!");
          const amount = event.args[0];
          assert.equal(
              amount.toString(), deposit.toString(), 
              "Expected the deposit amount to be emitted in the Approved event!"
          );
      });

      it("should set the isApproved state to true", async () => {
          const isApproved = await contract.isApproved();
          assert(isApproved, "Expected isApproved to be true!");
      });
  });
});

describe('EscrowDeploy', function () {
  let contract;
  let accounts = {};
  beforeEach(async () => {
      const roles = ['arbiter', 'beneficiary', 'depositor'];
      for (let i = 0; i < roles.length; i++) {
          const signer = ethers.provider.getSigner(i);
          const address = await signer.getAddress();
          accounts[roles[i]] = { signer, address }
      }

      const { abi, bytecode } = JSON.parse(require('fs').readFileSync(artifactLocation).toString());
      contract = await deploy(
          abi,
          bytecode,
          accounts.depositor.signer,
          accounts.arbiter.address,
          accounts.beneficiary.address
      );
  });

  it('should resolve with contract', async () => {
      assert(contract, "Expected the deploy function to return a promise resolving to a contract!");
  });

  it('should be funded', async () => {
      let balance = await ethers.provider.getBalance(contract.address);
      assert.equal(balance.toString(), deposit.toString());
  });

  it('should set an arbiter', async () => {
      const _arbiter = await contract.callStatic.arbiter();
      assert.equal(_arbiter, accounts.arbiter.address);
  });

  it('should set a depositor', async () => {
      const _depositor = await contract.callStatic.depositor();
      assert.equal(_depositor, accounts.depositor.address);
  });

  it('should set a beneficiary', async () => {
      const _beneficiary = await contract.beneficiary.call();
      assert.equal(_beneficiary, accounts.beneficiary.address);
  });
});

describe('EscrowApprove', function () {
  let contract;
  let accounts = {};
  beforeEach(async () => {
      const roles = ['arbiter', 'beneficiary', 'depositor'];
      for (let i = 0; i < roles.length; i++) {
          const signer = ethers.provider.getSigner(i);
          const address = await signer.getAddress();
          accounts[roles[i]] = { signer, address }
      }

      const Contract = await ethers.getContractFactory("Escrow");
      contract = await Contract.connect(accounts.depositor.signer).deploy(
          accounts.arbiter.address,
          accounts.beneficiary.address,
          { value: deposit }
      );
  });

  it('should be funded', async () => {
      const balance = await ethers.provider.getBalance(contract.address);
      assert.equal(balance.toString(), deposit.toString());
  });

  describe("after approval", () => {
      let balanceBefore;
      before(async () => {
          balanceBefore = await ethers.provider.getBalance(accounts.beneficiary.address);
          await approve(contract, accounts.arbiter.signer);
      });

      it("should transfer balance to beneficiary", async () => {
          const after = await ethers.provider.getBalance(accounts.beneficiary.address);
          assert.equal(after.sub(balanceBefore).toString(), deposit.toString());
      });
  });
});