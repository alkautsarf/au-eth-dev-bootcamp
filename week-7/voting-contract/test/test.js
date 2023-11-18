const { assert } = require('chai');
describe('Voting', function () {
    const interface = new ethers.utils.Interface(["function mint(uint) external"]);        
    const data = interface.encodeFunctionData("mint", [250]);
    const target = ethers.constants.AddressZero; 
    let proposal;

    before(async () => {
        creator = await ethers.provider.getSigner(0).getAddress();

        const Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy();
        await voting.deployed();
        
        await voting.newProposal(target, data);
        proposal = await voting.proposals(0);
    });

    it('should store the target', async () => {
        assert(proposal, 'Proposal not found');
        assert.equal(proposal.target, target);
    });

    it('should store the data', async () => {
        assert(proposal, 'Proposal not found');
        assert.equal(proposal.data, data);
    });

    it('should store a 0 yesCount', async () => {
        assert(proposal, 'Proposal not found');
        assert.equal(proposal.yesCount, 0);
    });

    it('should store a 0 noCount', async () => {
        assert(proposal, 'Proposal not found');
        assert.equal(proposal.noCount, 0);
    });
});
describe('Voting Track', function () {
  const interface = new ethers.utils.Interface(["function mint(uint) external"]);
  const data = interface.encodeFunctionData("mint", [250]);
  const target = ethers.constants.AddressZero; 
  let voter1, voter2;
  let contract;

  before(async () => {
      creator = await ethers.provider.getSigner(0).getAddress();
      voter1 = await ethers.provider.getSigner(1);
      voter2 = await ethers.provider.getSigner(2);

      const Voting = await ethers.getContractFactory("Voting");
      contract = await Voting.deploy();
      await contract.deployed();
  });

  describe('creating a new vote', () => {
      before(async () => {
          await contract.newProposal(target, data);
      });

      describe('casting four votes: three from the same address', () => {
          let attributes;
          before(async () => {
              let id = 0;
              await contract.connect(voter1).castVote(id, false);
              await contract.connect(voter1).castVote(id, true);
              await contract.connect(voter1).castVote(id, true);
              await contract.connect(voter2).castVote(id, false);
              attributes = await contract.proposals(id);
          });

          it('should have a yes count of 1', function () {
              assert(attributes.yesCount, 'Could not find the yes count');
              assert.equal(attributes.yesCount.toNumber(), 1);
          });

          it('should have a no count of 1', function () {
              assert(attributes.noCount, 'Could not find the no count');
              assert.equal(attributes.noCount.toNumber(), 1);
          });

          describe('creating a newer vote', function () {
              let attributes2;
              before(async () => {
                  await contract.newProposal(target, data);
              });

              describe('voting as the first voter', function () {
                  before(async () => {
                      let id = 1;
                      await contract.connect(voter1).castVote(id, true);
                      attributes2 = await contract.proposals(id);
                  });

                  it('should have a yes count of 1', function () {
                      assert(attributes2.yesCount, 'Could not find the yes count');
                      assert.equal(attributes2.yesCount.toNumber(), 1);
                  });

                  it('should have a no count of 0', function () {
                      assert(attributes2.noCount, 'Could not find the no count');
                      assert.equal(attributes2.noCount.toNumber(), 0);
                  });
              });
          });
      });
  });
});
describe('Voting Event', function () {
  const target = ethers.constants.AddressZero; 
  let accounts;
  let contract;

  before(async () => {
      accounts = await ethers.provider.listAccounts();

      const Voting = await ethers.getContractFactory("Voting");
      contract = await Voting.deploy();
      await contract.deployed();
  });

  describe('creating a new proposal', () => {
      const interface = new ethers.utils.Interface(["function mint(uint) external"]);
      const data1 = interface.encodeFunctionData("mint", [250]);
      const data2 = interface.encodeFunctionData("mint", [300]);
      let event1;
      beforeEach(async () => {
          const tx = await (await contract.newProposal(target, data1)).wait();
          event1 = tx.events.find(x => x.event === "ProposalCreated");
      });

      it('should broadcast a `ProposalCreated` event with a valid voteId', async () => {
          assert(event1, "The `newProposal` transaction did not emit a `ProposalCreated` event!");
          const proposal = await contract.proposals(event1.args[0]);
          assert.equal(proposal.data, data1);
      });

      describe('casting a vote', () => {
          let event2;
          beforeEach(async () => {
              const signer = await ethers.provider.getSigner(accounts[1]);
              const tx = await contract.connect(signer).castVote(0, false);
              const receipt = await tx.wait();
              event2 = receipt.events.find(x => x.event === "VoteCast");
          });

          it('should broadcast a `VoteCast` event with a valid voteId', async () => {
              assert(event2, "The `castVote` transaction did not emit a `VoteCast` event!");
              const proposal = await contract.proposals(event2.args[0]);
              assert.equal(proposal.data, data1);
          });

          it('should broadcast a `VoteCast` event with the correct address', async () => {
              assert(event2, "The `castVote` transaction did not emit a `VoteCast` event!");
              assert.equal(event2.args[1], accounts[1], "Expected the second argument of VoteCast to be the voter address!");
          });
      });
      
      describe('after creating a new proposal', () => {
          let event2;
          beforeEach(async () => {
              const tx = await contract.newProposal(target, data2);
              const receipt = await tx.wait();
              event2 = receipt.events.find(x => x.event === "ProposalCreated");
          });

          it('should broadcast a `ProposalCreated` event with a valid voteId', async () => {
              assert(event2, "The `newProposal` transaction did not emit a `ProposalCreated` event!");
              const proposal = await contract.proposals(event2.args[0]);
              assert.equal(proposal.data, data2);
          });

          describe('casting a vote on the initial proposal', () => {
              let event3;
              beforeEach(async () => {
                  const signer = await ethers.provider.getSigner(accounts[1]);
                  const tx = await contract.connect(signer).castVote(0, false);
                  const receipt = await tx.wait();
                  event3 = receipt.events.find(x => x.event === "VoteCast");
              });

              it('should broadcast a `VoteCast` event with the original voteId', async () => {
                  assert(event2, "The `castVote` transaction did not emit a `VoteCast` event!");
                  const proposal = await contract.proposals(event3.args[0]);
                  assert.equal(proposal.data, data1);
              });
          });
      });
  });
});
describe('VotingV2', function () {
  const interface = new ethers.utils.Interface(["function mint(uint) external"]);
  const data = interface.encodeFunctionData("mint", [250]);
  const target = ethers.constants.AddressZero; 
  let contract;

  before(async () => {
      owner = ethers.provider.getSigner(0);
      member1 = ethers.provider.getSigner(1);
      member2 = ethers.provider.getSigner(2);
      nonmember = ethers.provider.getSigner(3);

      const Voting = await ethers.getContractFactory("VotingV2");
      contract = await Voting.deploy([await member1.getAddress(), await member2.getAddress()]);
      await contract.deployed();
  });

  describe('creating a new proposal from a nonmember', () => {
      it('should revert', async () => {
          let ex;
          try {
              await contract.connect(nonmember).newProposal(target, data);
          }
          catch(_ex) {
              ex = _ex;
          }
          assert(ex, "Attempted to create new proposal from a nonmember. Expected this transaction to revert!");
      });
  });

  describe('creating a proposal from a member', () => {
      let receipt;
      before(async () => {
          const tx = await contract.connect(member1).newProposal(target, data);
          receipt = await tx.wait();
      });

      it('should emit an `ProposalCreated` event', () => {
          const event = receipt.events.find(x => x.event === "ProposalCreated");
          assert(event, "Event not found!");
      });

      describe('casting a vote as a nonmember', () => {
          it('should revert', async () => {
              let ex;
              try {
                  await contract.connect(nonmember).castVote(0, true);
              }
              catch (_ex) {
                  ex = _ex;
              }
              assert(ex, "Attempted to create new proposal from a nonmember. Expected this transaction to revert!");
          });
      });

      describe('casting a vote as the owner', () => {
          let receipt;
          before(async () => {
              const tx = await contract.connect(owner).castVote(0, false);
              receipt = await tx.wait();
          });

          it('should emit an `VoteCast` event', () => {
              const event = receipt.events.find(x => x.event === "VoteCast");
              assert(event, "Event not found!");
          });
      });

      describe('casting a vote as the member', () => {
          let receipt;
          before(async () => {
              const tx = await contract.connect(member2).castVote(0, true);
              receipt = await tx.wait();
          });

          it('should emit an `VoteCast` event', () => {
              const event = receipt.events.find(x => x.event === "VoteCast");
              assert(event, "Event not found!");
          });
      });
  });
});
// describe('Voting Execute', function () {
//   const amount = 250;
//   const interface = new ethers.utils.Interface(["function mint(uint) external"]);
//   const data = interface.encodeFunctionData("mint", [amount]);
//   let contract, signers;

//   before(async () => {
//       signers = await ethers.getSigners();

//       const Voting = await ethers.getContractFactory("VotingV2");
//       contract = await Voting.deploy(await Promise.all(signers.map(x => x.getAddress())));
//       await contract.deployed();

//       const Minter = await ethers.getContractFactory("Minter");
//       minter = await Minter.deploy();
//       await minter.deployed();

//       await contract.connect(signers[0]).newProposal(minter.address, data);
//   });

//   describe('voting yes 9 times', () => {
//       before(async () => {
//           for(let i = 0; i < 9; i++) {
//               const signer = signers[i];
//               await contract.connect(signer).castVote(0, true);
//           }
//       });

//       it('should not execute', async () => {
//           assert.equal(await minter.minted(), 0);
//       });

//       describe('voting a 10th time', () => {
//           before(async () => {
//               const signer = signers[9];
//               await contract.connect(signer).castVote(0, true);
//           });

//           it('should execute', async () => {
//               assert.equal(await minter.minted(), amount);
//           });
//       });
//   });
// });