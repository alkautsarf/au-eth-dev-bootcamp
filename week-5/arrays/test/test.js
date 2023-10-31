const {assert} = require('chai')
describe('Contract', function () {
    let contract;
    before(async () => {
        const Contract = await ethers.getContractFactory("Contract");
        contract = await Contract.deploy();
        await contract.deployed();
    });

    it('should return the sum', async () => {
        assert.equal(await contract.sum([1, 1, 1, 1, 1]), 5);
        assert.equal(await contract.sum([1, 2, 3, 4, 5]), 15);
    });
});

describe('Contract2', function () {
  let contract;
  before(async () => {
      const Contract = await ethers.getContractFactory("Contract2");
      contract = await Contract.deploy();
      await contract.deployed();
  });

  it('should return the sum', async () => {
      assert.equal(await contract.sum([5]), 5);
      assert.equal(await contract.sum([1, 1, 1]), 3);
      assert.equal(await contract.sum([1, 2, 3, 4, 5]), 15);
  });
});

describe('Contract3', function () {
  let contract;
  beforeEach(async () => {
      const Contract = await ethers.getContractFactory("Contract3");
      contract = await Contract.deploy();
      await contract.deployed();
  });

  it('should store the filtered evenNumbers', async () => {
      await contract.filterEven([1, 2, 1, 4, 5]);
      assert.sameMembers(await getArrayElements(contract.evenNumbers), [2, 4]);
  });

  it('should store the filtered evenNumbers', async () => {
      await contract.filterEven([1, 1, 2, 10, 2]);
      assert.sameMembers(await getArrayElements(contract.evenNumbers), [2, 10, 2]);
  });
});

async function getArrayElements(getterFn) {
  let vals = [];
  try {
      for (i = 0; ; i++) {
          vals.push(await getterFn(i));
      }
  }
  catch (ex) {}
  return vals.map(x => Number(x));
}

describe('Contract4', function () {
  let contract;
  beforeEach(async () => {
      const Contract = await ethers.getContractFactory("Contract4");
      contract = await Contract.deploy();
      await contract.deployed();
  });

  it('should return the filtered numbers', async () => {
      const result = await contract.filterEven([1, 2, 1, 4, 1]);
      assert.sameMembers(result.map(x => Number(x)), [2, 4]);

      const result2 = await contract.filterEven([1, 1, 2, 10, 2]);
      assert.sameMembers(result2.map(x => Number(x)), [2, 10, 2]);
  });
});

describe('StackClub', function () {
  let contract;
  let accounts;
  before(async () => {
      const StackClub = await ethers.getContractFactory("StackClub");
      contract = await StackClub.deploy();
      await contract.deployed();

      accounts = await ethers.provider.listAccounts();
  });

  describe('after adding a few members', () => {
      before(async () => {
          for(let i = 0; i < 3; i++) {
              await contract.addMember(accounts[i]);
          }
      });

      it('should detect members', async () => {
          for (let i = 0; i < 3; i++) {
              assert(await contract.isMember(accounts[i]));
          }
      });

      it('should detect non-members', async () => {
          for (let i = 3; i < 6; i++) {
              assert(!(await contract.isMember(accounts[i])));
          }
      });
  });
});

describe('StackClubSecure', function () {
  let contract;
  let accounts;
  let owner;
  beforeEach(async () => {
      const StackClub = await ethers.getContractFactory("StackClubSecure");
      contract = await StackClub.deploy();
      await contract.deployed();

      owner = ethers.provider.getSigner(0);
      accounts = (await ethers.provider.listAccounts()).slice(1)
  });

  it('should not allow a non-member to add a member', async () => {
      await assertRevert(
          contract.connect(accounts[0]).addMember(accounts[0]),
          "A member should not be allowed to add a member. Expected the transaction to revert!"
      );
  });

  it('should not allow a non-member to remove last member', async () => {
      await assertRevert(
          contract.connect(accounts[0]).removeLastMember(),
          "A member should not be allowed to remove last member. Expected the transaction to revert!"
      );
  });

  describe('after adding a few members', () => {
      beforeEach(async () => {
          for (let i = 0; i < 3; i++) {
              await contract.connect(owner).addMember(accounts[i]);
          }
      });

      it('should detect members', async () => {
          for (let i = 0; i < 3; i++) {
              assert(await contract.isMember(accounts[i]));
          }
      });

      it('should detect non-members', async () => {
          for (let i = 3; i < 6; i++) {
              assert(!(await contract.isMember(accounts[i])));
          }
      });

      describe('after calling removeLastMember as a member', () => {
          beforeEach(async () => {
              const signer = ethers.provider.getSigner(accounts[1]);
              await contract.connect(signer).removeLastMember();
          });

          it("It should pop off the most recent club member", async () => {
              assert(!(await contract.isMember(accounts[2])), "expected the most recently added member to be removed");
          });

          describe('after calling removeLastMember twice', () => {
              beforeEach(async () => {
                  const signer = ethers.provider.getSigner(accounts[1]);
                  await contract.connect(signer).removeLastMember();
              });

              it("It should pop off the most recent club member", async () => {
                  assert(!(await contract.isMember(accounts[1])), "expected the most recently added member to be removed");
              });
          });
      });
  });
});

async function assertRevert(promise, msg) {
  let ex;
  try {
      await promise;
  }
  catch (_ex) {
      ex = _ex;
  }
  assert(ex, msg);
}