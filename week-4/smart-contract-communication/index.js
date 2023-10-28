require("dotenv").config();

const ethers = require("ethers");

const abi = [
  {
    inputs: [],
    name: "count",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dec",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "get",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "inc",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const provider = new ethers.AlchemyProvider(
  "goerli",
  process.env.ALCHEMY_API_KEY
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  "0x5F91eCd82b662D645b15Fd7D2e20E5e5701CCB7A",
  abi,
  wallet
);
const getCurr = async () => {
  const curr = await contract.count();
  console.log(curr.toString());
};
const inc = async () => {
  const tx = await contract.inc();
  console.log(tx);
};
const dec = async () => {
  const tx = await contract.dec();
  console.log(tx);
};

inc().then(() => getCurr());
