const ethers = require("ethers");

async function getValue(contract) {
  return await contract.value();
}

async function setValue(contract) {
  return await contract.modify(7);
}

async function transfer(contract, friend) {
    return await contract.transfer(friend, 777);
}

async function setMessage(contract, signer) {
    const contract_ = await contract.connect(signer);
    return await contract_.modify("Hello World!");
}

async function deposit(contract) {
    return await contract.deposit({
        value: ethers.parseEther("1")
    })
}


module.exports = { getValue, setValue, transfer, setMessage };
