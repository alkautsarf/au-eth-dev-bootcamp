// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// async function main() {
//   const provider = new hre.ethers.providers.JsonRpcProvider(process.env.ALCHEMY_GOERLI_URL);
//   const deployer = new hre.ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, provider);

//   console.log("Deploying contracts with the account:", deployer.address);

//   const weiAmount = (await deployer.getBalance()).toString();
  
//   console.log("Account balance:", (await hre.ethers.utils.formatEther(weiAmount)));

//   const artifacts = await hre.artifacts.readArtifact("Token");

//   // make sure to replace the "GoofyGoober" reference with your own ERC-20 name!
//   const Token = await new hre.ethers.ContractFactory(artifacts.abi, artifacts.bytecode, deployer);
//   const token = await Token.deploy();

//   console.log("Token address:", token.address);
// }

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const weiAmount = (await deployer.getBalance()).toString();
  
  console.log("Account balance:", (await ethers.utils.formatEther(weiAmount)));

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
