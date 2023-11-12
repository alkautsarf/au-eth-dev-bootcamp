// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require('dotenv').config();

async function main() {
  const Contract = await hre.ethers.getContractFactory('ContractEmitter')
  const contract = await Contract.deploy();

  await contract.deployed()

  console.log(
    `Contract deployed to address: ${contract.address}`
  );
  
  await contract.confirm(process.env.CONTRACT_ADDRESS, process.env.TOKEN_ADDRESS);


  await contract.call(process.env.CONTRACT_ADDRESS, process.env.TOKEN_ADDRESS, hre.ethers.utils.parseEther('1'));
  
  console.log('Contract called');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
