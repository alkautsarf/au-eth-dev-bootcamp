const { ethers } = require("hardhat");

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const token = await ethers.getContractAt("MyToken", "0x10f9d71874FcD0B64fDC611B10C4eF510f5A3Ade", owner)
//   const governor = await ethers.getContractAt("MyGovernor", "0x13257d8be229d8b469f0cdC20A7cEbFA5BfB04dE", owner )

  const delegated = await token.delegate(owner.address);
  console.log("delegated: ", delegated);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
