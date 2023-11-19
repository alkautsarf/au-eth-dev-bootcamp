const { ethers } = require("hardhat");
const {formatEther} = ethers.utils

async function main() {
  try {
    const [owner, otherAccount] = await ethers.getSigners();

    const token = await ethers.getContractAt(
      "MyToken",
      "0x10f9d71874FcD0B64fDC611B10C4eF510f5A3Ade",
      owner
    );
    const governor = await ethers.getContractAt(
      "MyGovernor",
      "0x13257d8be229d8b469f0cdC20A7cEbFA5BfB04dE",
      owner
    );

    // const delegated = await token.delegate(owner.address);

    const proposalId = ethers.BigNumber.from(
      "64613337686171001584084850745276853799107264179490530930673505494879486903540"
    );
    // const proposalId = formatEther(
    //     "64613337686171001584084850745276853799107264179490530930673505494879486903540"
    // );

    console.log("Proposal Id: ", proposalId);

    const tx = await governor.castVote("64613337686171001584084850745276853799107264179490530930673505494879486903540", "1");

    console.log("voting: ", tx);
  } catch (e) {
    console.log(e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
