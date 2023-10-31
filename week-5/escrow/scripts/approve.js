/**
 * Approves the Escrow, signed by the arbiter
 *
 * @param {ethers.Contract} contract - ethers.js contract instance
 * @param {ethers.types.Signer} arbiterSigner - the arbiter EOA
 * 
 * @return {promise} a promise of the approve transaction
 */
async function approve(contract, arbiterSigner) {
    const promise = await contract.connect(arbiterSigner).approve()
    return promise;
}

module.exports = approve;