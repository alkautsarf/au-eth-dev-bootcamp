const { assert } = require('chai');
// describe('Hero', function () {
//     let warrior;
//     let mage;
//     before(async () => {
//         const Warrior = await ethers.getContractFactory("Warrior");
//         warrior = await Warrior.deploy();
//         await warrior.deployed();

//         const Mage = await ethers.getContractFactory("Mage");
//         mage = await Mage.deploy();
//         await mage.deployed();
//     });

//     describe('Warrior', () => {
//         it('should have 200 health initially', async () => {
//             const health = await warrior.health();
//             assert.equal(health.toNumber(), 200);
//         });

//         it('should take damage', async () => {
//             await warrior.takeDamage(10);
//             const health = await warrior.health();
//             assert.equal(health.toNumber(), 190);
//         });
//     });

//     describe('Mage', () => {
//         it('should have 50 health initially', async () => {
//             const health = await mage.health();
//             assert.equal(health.toNumber(), 50);
//         });

//         it('should take damage', async () => {
//             await mage.takeDamage(10);
//             const health = await mage.health();
//             assert.equal(health.toNumber(), 40);
//         });
//     });
// });

// const ATTACK_TYPES = {
//   BRAWL: 0,
//   SPELL: 1,
// }
// describe('Hero2', function () {
//   let warrior;
//   let mage;
//   let Enemy;
//   before(async () => {
//     // Enemy contract is not defined in the repo
//       Enemy = await ethers.getContractFactory("EnemyContract");

//       const Warrior = await ethers.getContractFactory("Warrior");
//       warrior = await Warrior.deploy();
//       await warrior.deployed();

//       const Mage = await ethers.getContractFactory("Mage");
//       mage = await Mage.deploy();
//       await mage.deployed();
//   });

//   describe('Warrior', () => {
//       let enemy;
//       let receipt;
//       before(async () => {
//           enemy = await Enemy.deploy();
//           await enemy.deployed();

//           const tx = await warrior.attack(enemy.address);
//           receipt = await tx.wait();
//       });

//       it('should attack the enemy with a brawl type attack', async () => {
//           const topic = Enemy.interface.getEventTopic("Attacked");
//           const log = receipt.logs.find(x => x.topics[0] === topic);
//           assert(log, "Expected the enemy to take an attack! Attack not registered on the enemy.");
//           assert.equal(Number(log.data), ATTACK_TYPES.BRAWL, "Expected the attack from warrior to be of AttackType Brawl");
//       });
//   });

//   describe('Mage', () => {
//       let enemy;
//       let receipt;
//       before(async () => {
//           enemy = await Enemy.deploy();
//           await enemy.deployed();

//           const tx = await mage.attack(enemy.address);
//           receipt = await tx.wait();
//       });

//       it('should attack the enemy with a spell type attack', async () => {
//           const topic = Enemy.interface.getEventTopic("Attacked");
//           const log = receipt.logs.find(x => x.topics[0] === topic);
//           assert(log, "Expected the enemy to take an attack! Attack not registered on the enemy.");
//           assert.equal(Number(log.data), ATTACK_TYPES.SPELL, "Expected the attack from mage to be of AttackType Spell");
//       });
//   });
// });

// describe('Hero3', function () {
//   let warrior;
//   let mage;
//   let Enemy;
//   before(async () => {
//       Enemy = await ethers.getContractFactory("EnemyContract");

//       const Warrior = await ethers.getContractFactory("Warrior1");
//       warrior = await Warrior.deploy();
//       await warrior.deployed();

//       const Mage = await ethers.getContractFactory("Mage1");
//       mage = await Mage.deploy();
//       await mage.deployed();
//   });

//   describe('Warrior', () => {
//       let enemy;
//       let receipt;
//       before(async () => {
//           enemy = await Enemy.deploy();
//           await enemy.deployed();

//           const tx = await warrior.attack(enemy.address);
//           receipt = await tx.wait();
//       });

//       it('should attack the enemy with a brawl type attack', async () => {
//           const topic = Enemy.interface.getEventTopic("Attacked");
//           const log = receipt.logs.find(x => x.topics[0] === topic);
//           assert(log, "Expected the enemy to take an attack! Attack not registered on the enemy.");
//           assert.equal(Number(log.data), ATTACK_TYPES.BRAWL, "Expected the attack from warrior to be of AttackType Brawl");
//       });

//       it('should use some energy', async () => {
//           const energy = await warrior.energy();
//           assert.equal(energy, 9);
//       });
//   });

//   describe('Mage', () => {
//       let enemy;
//       let receipt;
//       before(async () => {
//           enemy = await Enemy.deploy();
//           await enemy.deployed();

//           const tx = await mage.attack(enemy.address);
//           receipt = await tx.wait();
//       });

//       it('should attack the enemy with a spell type attack', async () => {
//           const topic = Enemy.interface.getEventTopic("Attacked");
//           const log = receipt.logs.find(x => x.topics[0] === topic);
//           assert(log, "Expected the enemy to take an attack! Attack not registered on the enemy.");
//           assert.equal(Number(log.data), ATTACK_TYPES.SPELL, "Expected the attack from mage to be of AttackType Spell");
//       });

//       it('should use some energy', async () => {
//           const energy = await mage.energy();
//           assert.equal(energy, 9);
//       });
//   });
// });

describe('Collectible', function () {
  let contract;
  before(async () => {
      const Collectible = await ethers.getContractFactory("Collectible");
      contract = await Collectible.deploy();
      await contract.deployed();
  });

  it('should allow the owner to mark the price', async () => {
      await contract.markPrice(5);
      const val = await contract.callStatic.price();
      assert.equal(val, 5);
  });

  it('should throw if someone else tries to change the variable', async () => {
      let ex; 
      try {
          await contract.connect(ethers.provider.getSigner(1)).markPrice(5);
      }
      catch(_ex) {
          ex = _ex;
      }
      assert(ex, "Expected it to revert");
  });
});

describe('Collectible2', function () {
    let contract;
    let a2, s2;
    before(async () => {
        const Collectible = await ethers.getContractFactory("Collectible");
        contract = await Collectible.deploy();
        await contract.deployed();
        
        s2 = ethers.provider.getSigner(1);
        a2 = await s2.getAddress();
    });

    it('should allow the owner to mark the price', async () => {
        await contract.markPrice(5);
        const val = await contract.callStatic.price();
        assert.equal(val.toNumber(), 5);
    });

    it('should throw if someone else tries to mark the price', async () => {
        let ex;
        try {
            await contract.connect(s2).markPrice(5);
        }
        catch (_ex) {
            ex = _ex;
        }
        assert(ex, "Expected the transaction to revert! Only the owner can mark the price.");
    });

    it('should throw if someone else tries to transfer the collectible', async () => {
        let ex;
        try {
            await contract.connect(s2).transfer(a2);
        }
        catch (_ex) {
            ex = _ex;
        }
        assert(ex, "Expected the transaction to revert! Only the owner can transfer the collectible.");
    });

    describe('after transferring', () => {
        before(async () => {
            await contract.transfer(a2);
        });

        it('should allow the new owner to mark the price', async () => {
            await contract.connect(s2).markPrice(10);
            const val = await contract.callStatic.price();
            assert.equal(val, 10);
        });        
    });
});