// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// replace the name of the contract with which one you want to deploy!
const contractName = "Game";

async function main() {
  let addresses = [];
  for (let i = 0; i < 5; i++) {
    const Game = await hre.ethers.getContractFactory(`${contractName}${i + 1}`);
    // if you need to add constructor arguments for the particular game, add them here:
    const game = await Game.deploy();
    addresses.push(game.target);
    console.log(`${contractName}${i + 1} deployed to address: ${game.target}`);
  }
  return addresses
}

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

  module.exports = main



