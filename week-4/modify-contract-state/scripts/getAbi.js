const ethers = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

const txHash =
  "0xebac236e4abe5ad4534e9277eebca9d7df753002175de710ee647805512f2213";

// provider
//   .getTransaction(txHash)
//   .then((tx) => console.log("ABI", tx.data))
//   .catch((err) => console.log(err));

const constructorArguments = [7, "Hello World"];

// Encode the constructor arguments in ABI-encoded format
const encodedData = ethers.utils.defaultAbiCoder.encode(
  [
    {
      internalType: "uint256",
      name: "_x",
      type: "uint256",
    },
    {
      internalType: "string",
      name: "_message",
      type: "string",
    },
  ],
  constructorArguments
);

console.log("ABI-encoded constructor arguments:", encodedData);
