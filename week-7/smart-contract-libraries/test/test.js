const { assert } = require("chai");
describe("UintFunctions", function () {
  let library;
  before(async () => {
    const Library = await ethers.getContractFactory("UintFunctions");
    library = await Library.deploy();
    await library.deployed();
  });

  it("should create detect even numbers", async () => {
    const evens = [2, 4, 6];
    for (let i = 0; i < evens.length; i++) {
      const even = evens[i];
      const isEven = await library.callStatic.isEven(even);
      assert(isEven, `Expected isEven to return true for ${i}!`);
    }
  });

  it("should create detect odd numbers", async () => {
    const odds = [1, 3, 5];
    for (let i = 0; i < odds.length; i++) {
      const odd = odds[i];
      const isEven = await library.callStatic.isEven(odd);
      assert(!isEven, `Did not expect isEven to return true for ${i}!`);
    }
  });
});

describe("Game", function () {
  let library;
  before(async () => {
    const Library = await ethers.getContractFactory("UintFunctions");
    library = await Library.deploy();
    await library.deployed();
  });

  [2, 4, 6].forEach((participants) => {
    describe(`for an even game of ${participants} participants`, () => {
      let contract;
      before(async () => {
        const Contract = await ethers.getContractFactory("Game", {
          libraries: { UintFunctions: library.address },
        });
        contract = await Contract.deploy(participants);
        await contract.deployed();
      });

      it("should store the number of participants", async () => {
        const actual = await contract.callStatic.participants();
        assert.equal(actual, participants);
      });

      it("should allow teams", async () => {
        const allowed = await contract.callStatic.allowTeams();
        assert(allowed);
      });
    });
  });

  [3, 5, 7].forEach((participants) => {
    describe(`for an odd game of ${participants} participants`, () => {
      let contract;
      before(async () => {
        const Contract = await ethers.getContractFactory("Game", {
          libraries: { UintFunctions: library.address },
        });
        contract = await Contract.deploy(participants);
        await contract.deployed();
      });

      it("should store the number of participants", async () => {
        const actual = await contract.participants.call();
        assert.equal(actual, participants);
      });

      it("should not allow teams", async () => {
        const allowed = await contract.allowTeams.call();
        assert(!allowed);
      });
    });
  });
});

describe("Contract", function () {
  let contract;
  before(async () => {
    const Contract = await ethers.getContractFactory("Contract");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("should create variable a: true", async () => {
    const response = await contract.callStatic.getSecret("1337");
    assert.equal(response, 1337);
  });
});

describe('Prime', function () {
  let library;
  before(async () => {
      const Prime = await ethers.getContractFactory("Prime");
      library = await Prime.deploy();
      await library.deployed();
  });

  it('should detect numbers that evenly divide', async () => {
      const pairs = [[4, 2], [16, 4], [200, 50]];
      for (let i = 0; i < pairs.length; i++) {
          const [x,y] = pairs[i];
          const dividesEvenly = await library.callStatic.dividesEvenly(x, y);
          assert(dividesEvenly, `Expected dividesEvenly to return true for ${x} divided by ${y}!`);
      }
  });

  it('should detect numbers that do not evenly divide', async () => {
      const pairs = [[5, 2], [22, 4], [199, 50]];
      for (let i = 0; i < pairs.length; i++) {
          const [x, y] = pairs[i];
          const dividesEvenly = await library.callStatic.dividesEvenly(x, y);
          assert(!dividesEvenly, `Expected dividesEvenly to return false for ${x} divided by ${y}!`);
      }
  });

  it('should detect prime numbers', async () => {
    const primes = [5, 17, 47];
    for (let i = 0; i < primes.length; i++) {
        const prime = primes[i];
        const isPrime = await library.callStatic.isPrime(prime);
        assert(isPrime, `Expected isPrime to return true for ${prime}!`);
    }
});

it('should detect non-prime numbers', async () => {
    const nonPrimes = [4, 18, 51];
    for (let i = 0; i < nonPrimes.length; i++) {
        const nonPrime = nonPrimes[i];
        const isPrime = await library.callStatic.isPrime(nonPrime);
        assert(!isPrime, `Did not expect isPrime to return true for ${nonPrime}!`);
    }
});
});

const mineBlock = () => ethers.provider.send("evm_mine");

describe('PrimeGame', function () {
    let contract;
    before(async () => {
        const Prime = await ethers.getContractFactory("Prime");
        library = await Prime.deploy();
        await library.deployed();

        const PrimeGame = await ethers.getContractFactory("PrimeGame", { libraries: { Prime: library.address } });
        contract = await PrimeGame.deploy();
        await contract.deployed();
    });

    // blocks 0 & 1 are used for initialization
    describe('for block number 13', () => {
        before(async () => {
            await mineBlock();
        });

        it('should be a winner', async () => {
            const isWinner = await contract.callStatic.isWinner();
            assert(isWinner, "Expected block 13 to be a winner");
        });
    });

    describe('for block number 14', () => {
        before(async () => {
            await mineBlock();
        });

        it('should be a winner', async () => {
            const isWinner = await contract.callStatic.isWinner();
            assert(!isWinner, "Expected block 14 to not be a winner");
        });
    });

    describe('for block number 5', () => {
        before(async () => {
            await mineBlock();
        });

        it('should be a winner', async () => {
            const isWinner = await contract.callStatic.isWinner();
            assert(!isWinner, "Expected block 15 to be a winner");
        });
    });

    describe('for block number 28', () => {
        before(async () => {
            for(let i = 5; i < 18; i++) {
                await mineBlock();
            }
        });

        it('should be a winner', async () => {
            const isWinner = await contract.callStatic.isWinner();
            assert(!isWinner, "Expected block 28 to not be a winner");
        });
    });

    describe('for block number 29', () => {
        before(async () => {
            await mineBlock();
        });

        it('should be a winner', async () => {
            const isWinner = await contract.callStatic.isWinner();
            assert(isWinner, "Expected block 29 to be a winner");
        });
    });
});