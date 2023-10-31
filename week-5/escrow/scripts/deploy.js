// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

/**
 * Deploys the Escrow contract with a 1 ether deposit
 *
 * @param {array} abi - interface for the Escrow contract
 * @param {string} bytecode - EVM code for the Escrow contract
 * @param {ethers.types.Signer} signer - the depositor EOA
 * @param {string} arbiterAddress - hexadecimal address for arbiter
 * @param {string} beneficiaryAddress - hexadecimal address for benefiiciary
 * 
 * @return {promise} a promise of the contract deployment
 */
function deploy(abi, bytecode, signer, arbiterAddress, beneficiaryAddress) {
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const promise = factory.deploy(arbiterAddress, beneficiaryAddress, {value : hre.ethers.utils.parseEther("1")});
    return promise;
}

module.exports = deploy;
