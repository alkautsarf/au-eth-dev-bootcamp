const { assert } = require('chai');
const CHOICES = {
    YES: 0,
    NO: 1,
}
describe('Contract', function () {
    let contract;
    let accounts;
    before(async () => {
        const Contract = await ethers.getContractFactory("Contract");
        contract = await Contract.deploy();
        await contract.deployed();

        accounts = (await ethers.provider.listAccounts()).map((address) => ({
            address,
            signer: ethers.provider.getSigner(address)
        }));
    });

    describe('after voting yes', () => {
        before(async () => {
            await contract.connect(accounts[0].signer).createVote(CHOICES.YES);
        });

        it('should store a vote', async () => {
            const vote = await contract.vote();
            assert.equal(vote.choice, CHOICES.YES);
            assert.equal(vote.voter, accounts[0].address);
        });
    });

    describe('after voting no', () => {
        before(async () => {
            await contract.connect(accounts[1].signer).createVote(CHOICES.NO);
        });

        it('should return a vote', async () => {
            const vote = await contract.vote();
            assert.equal(vote.choice, CHOICES.NO);
            assert.equal(vote.voter, accounts[1].address);
        });
    });
});

describe('ContractExp', function () {
  let contract;
  let accounts;
  before(async () => {
      const Contract = await ethers.getContractFactory("ContractExp");
      contract = await Contract.deploy();
      await contract.deployed();

      accounts = (await ethers.provider.listAccounts()).map((address) => ({
          address,
          signer: ethers.provider.getSigner(address)
      }));
  });

  describe('after voting yes', () => {
      let vote;
      before(async () => {
          vote = await contract.connect(accounts[0].signer).callStatic.createVote(CHOICES.YES);
      });

      it('should return a vote', async () => {
          assert.equal(vote.choice, CHOICES.YES);
          assert.equal(vote.voter, accounts[0].address);
      });
  });

  describe('after voting no', () => {
      let vote;
      before(async () => {
          vote = await contract.connect(accounts[1].signer).callStatic.createVote(CHOICES.NO);
      });

      it('should return a vote', async () => {
          assert.equal(vote.choice, CHOICES.NO);
          assert.equal(vote.voter, accounts[1].address);
      });
  });
});

describe('ContractArray', function () {
  let contract;
  let accounts;
  before(async () => {
      const Contract = await ethers.getContractFactory("ContractArray");
      contract = await Contract.deploy();
      await contract.deployed();

      accounts = (await ethers.provider.listAccounts()).map((address) => ({
          address,
          signer: ethers.provider.getSigner(address)
      }));
  });

  describe('after voting yes', () => {
      before(async () => {
          await contract.connect(accounts[0].signer).createVote(CHOICES.YES);
      });

      it('should store a vote', async () => {
          const vote = await contract.votes(0);
          assert.equal(vote.choice, CHOICES.YES);
          assert.equal(vote.voter, accounts[0].address);
      });
  });

  describe('after voting no', () => {
      before(async () => {
          await contract.connect(accounts[1].signer).createVote(CHOICES.NO);
      });

      it('should store a vote', async () => {
          const vote = await contract.votes(1);
          assert.equal(vote.choice, CHOICES.NO);
          assert.equal(vote.voter, accounts[1].address);
      });
  });
});

describe('ContractLookup', function () {
  let contract;
  let accounts;
  before(async () => {
      const Contract = await ethers.getContractFactory("ContractLookup");
      contract = await Contract.deploy();
      await contract.deployed();

      accounts = (await ethers.provider.listAccounts()).map((address) => ({
          address,
          signer: ethers.provider.getSigner(address)
      }));
  });

  describe('after voting yes', () => {
      before(async () => {
          await contract.connect(accounts[0].signer).createVote(CHOICES.YES);
      });

      it('should return true for this address having voted', async () => {
          assert(await contract.hasVoted(accounts[0].address));
      });

      it('should find a choice for the address', async () => {
          const choice = await contract.findChoice(accounts[0].address);
          assert.equal(choice, CHOICES.YES);
      });

      it('should not return true for a different address having voted', async () => {
          assert(!(await contract.hasVoted(accounts[1].address)));
      });
  });

  describe('after voting no', () => {
      before(async () => {
          await contract.connect(accounts[1].signer).createVote(CHOICES.NO);
      });

      it('should return true for this address having voted', async () => {
          assert(await contract.hasVoted(accounts[1].address));
      });

      it('should find a choice for the address', async () => {
          const choice = await contract.findChoice(accounts[1].address);
          assert.equal(choice, CHOICES.NO);
      });
  });
});

describe('ContractRevert', function () {
  let contract;
  let accounts;
  before(async () => {
      const Contract = await ethers.getContractFactory("ContractRevert");
      contract = await Contract.deploy();
      await contract.deployed();

      accounts = (await ethers.provider.listAccounts()).map((address) => ({
          address,
          signer: ethers.provider.getSigner(address)
      }));
  });

  describe('after voting yes', () => {
      before(async () => {
          await contract.connect(accounts[0].signer).createVote(CHOICES.YES);
      });

      it('should store a new vote', async () => {
          const vote = await contract.votes(0);
          assert.equal(vote.choice, CHOICES.YES);
          assert.equal(vote.voter, accounts[0].address);
      });

      it('should not allow the same address to vote again', async () => {
          let ex;
          try {
              await contract.connect(accounts[0].signer).createVote(CHOICES.NO);
          }
          catch(_ex) {
              ex = _ex;
          }
          assert(ex, "Expected the transaction to revert! This address has already voted.");
      });
  });

  describe('after voting no', () => {
      before(async () => {
          await contract.connect(accounts[1].signer).createVote(CHOICES.NO);
      });

      it('should store a new vote', async () => {
          const vote = await contract.votes(1);
          assert.equal(vote.choice, CHOICES.NO);
          assert.equal(vote.voter, accounts[1].address);
      });

      it('should not allow the same address to vote again', async () => {
          let ex;
          try {
              await contract.connect(accounts[1].signer).createVote(CHOICES.NO);
          }
          catch (_ex) {
              ex = _ex;
          }
          assert(ex, "Expected the transaction to revert! This address has already voted.");
      });
  });
});

describe('ContractFinal', function () {
  let contract;
  let accounts;
  before(async () => {
      const Contract = await ethers.getContractFactory("ContractFinal");
      contract = await Contract.deploy();
      await contract.deployed();

      accounts = (await ethers.provider.listAccounts()).map((address) => ({
          address,
          signer: ethers.provider.getSigner(address)
      }));
  });

  it('should not allow an address to change a non-existent vote', async () => {
      let ex;
      try {
          await contract.changeVote(CHOICES.NO, { from: a1 });
      }
      catch (_ex) {
          ex = _ex;
      }
      assert(ex, "Expected the transaction to revert! This address cannot change a non-existing vote.");
  });

  describe('after voting yes', () => {
      before(async () => {
          await contract.connect(accounts[0].signer).createVote(CHOICES.YES);
      });

      it('should return true for this address having voted', async () => {
          assert(await contract.hasVoted(accounts[0].address));
      });

      it('should find a choice for the address', async () => {
          const choice = await contract.findChoice(accounts[0].address);
          assert.equal(choice, CHOICES.YES);
      });

      it('should not allow the same address to vote again', async () => {
          let ex;
          try {
              await contract.connect(accounts[0].signer).createVote(CHOICES.NO);
          }
          catch (_ex) {
              ex = _ex;
          }
          assert(ex, "Expected the transaction to revert! This address has already voted.");
      });

      describe('after changing to no', () => {
          before(async () => {
              await contract.connect(accounts[0].signer).changeVote(CHOICES.NO);
          });

          it('should update the vote', async () => {
              const choice = await contract.findChoice(accounts[0].address);
              assert.equal(choice, CHOICES.NO);
          });
      });
  });

  describe('after voting no', () => {
      before(async () => {
          await contract.connect(accounts[1].signer).createVote(CHOICES.NO);
      });

      it('should return true for this address having voted', async () => {
          assert(await contract.hasVoted(accounts[1].address));
      });

      it('should find a choice for the address', async () => {
          const choice = await contract.findChoice(accounts[1].address);
          assert.equal(choice, CHOICES.NO);
      });

      it('should not allow the same address to vote again', async () => {
          let ex;
          try {
              await contract.connect(accounts[1].signer).createVote(CHOICES.NO);
          }
          catch (_ex) {
              ex = _ex;
          }
          assert(ex, "Expected the transaction to revert! This address has already voted.");
      });

      describe('after changing to yes', () => {
          before(async () => {
              await contract.connect(accounts[1].signer).changeVote(CHOICES.YES);
          });

          it('should update the vote', async () => {
              const choice = await contract.findChoice(accounts[1].address);
              assert.equal(choice, CHOICES.YES);
          });
      });
  });
});