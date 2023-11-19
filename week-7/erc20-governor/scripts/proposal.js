const { ethers } = require("hardhat");

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();
  
  const token = await ethers.getContractAt("MyToken", "0x10f9d71874FcD0B64fDC611B10C4eF510f5A3Ade", owner)
  const governor = await ethers.getContractAt("MyGovernor", "0x13257d8be229d8b469f0cdC20A7cEbFA5BfB04dE", owner )

  const tx = await governor.propose(
    [token.address],
    [0],
    [token.interface.encodeFunctionData("mint", [owner.address, ethers.utils.parseEther("25000")])],
    "Give the owner 25000 more tokens!"
  );
  const receipt = await tx.wait();
  const event = receipt.events.find(x => x.event === 'ProposalCreated');
  const { proposalId } = event.args;

  console.log("Proposal Id: ", proposalId);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
