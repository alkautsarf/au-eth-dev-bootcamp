const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
  const transactionCount = await owner.getTransactionCount();

  // gets the address of the token before it is deployed
  const futureAddress = ethers.utils.getContractAddress({
    from: owner.address,
    nonce: transactionCount + 1,
  });

  const MyGovernor = await ethers.getContractFactory("MyGovernor");
  const governor = await MyGovernor.deploy(futureAddress);

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(governor.address);

  console.log(
    `Governor deployed to ${governor.address}`,
    `Token deployed to ${token.address}`
  );

  await token
    .delegate(owner.address)
    .then(() => console.log("Delegated!"))
    .catch((error) => console.log(error));

  const tx = await governor.propose(
    [token.address],
    [0],
    [
      token.interface.encodeFunctionData("mint", [
        owner.address,
        ethers.utils.parseEther("25000"),
      ]),
    ],
    "Give the owner more tokens!"
  );
  const receipt = await tx.wait();
  const event = receipt.events.find((x) => x.event === "ProposalCreated");
  const { proposalId } = event.args;

  async function repeatEvmMine(times) {
    if (times > 0) {
      await hre.network.provider.send("evm_mine");
      await repeatEvmMine(times - 1);
    }
  }
  await repeatEvmMine(1);

  console.log(proposalId, '<<<<<< proposalidq');
  
  const vote = await governor.castVote(proposalId, 1);  
  
  // await repeatEvmMine(10);

  await governor.execute(
    [token.address],
    [0],
    [token.interface.encodeFunctionData("mint", [owner.address, ethers.utils.parseEther("25000")])],
    keccak256(toUtf8Bytes("Give the owner more tokens!"))
  )
  .then(() => console.log("Executed!"))
  .catch((error) => console.log(error));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
