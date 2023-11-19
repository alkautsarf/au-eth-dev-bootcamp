const { ethers } = require("hardhat");
const { toUtf8Bytes, keccak256, parseEther} = ethers.utils;

async function main() {
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

  await governor.execute(
    [token.address],
    [0],
    [token.interface.encodeFunctionData("mint", [owner.address, parseEther("25000")])],
    keccak256(toUtf8Bytes("Give the owner 25000 more tokens!"))
  );
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
