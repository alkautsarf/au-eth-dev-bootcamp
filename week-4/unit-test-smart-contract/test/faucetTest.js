const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Faucet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy({
      value: ethers.utils.parseEther("1.0") // Sending 1 Ether during deployment
  });

    const [owner, notOwner] = await ethers.getSigners();

    const withdrawAmount = ethers.utils.parseUnits("1", "ether");

    return { faucet, owner, withdrawAmount, notOwner };
  }

  it("should deploy and set the owner correctly", async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it("should not allow withdawals above .1 ETH at a time", async function () {
    const { faucet, withdrawAmount } = await loadFixture(
      deployContractAndSetVariables
    );
    expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it("should only allow onwner to call destroyFaucet", async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
    expect( faucet.destroyFaucet()).to.be;
  });

  it("should not allow non-owner to call destroyFaucet", async function () {
    const { faucet, notOwner } = await loadFixture(
      deployContractAndSetVariables
    );
    expect(faucet.connect(notOwner).destroyFaucet()).to.be.reverted;
  });

  it("should withdraw all of the remaining ethers to the caller", async function () {
    const { faucet, owner, notOwner } = await loadFixture(
      deployContractAndSetVariables
    );

    // Get the initial balance of the contract
    const initialBalance = await ethers.provider.getBalance(faucet.address);
    
    // Call withdrawAll() as the owner
    const tx = await faucet.connect(owner).withdrawAll();
    
    // Wait for the transaction to be mined
    await tx.wait();

    // console.log(tx)
    
    const currBalance = await ethers.provider.getBalance(faucet.address)

    // Check that the owner now has all of the ethers
    expect(await currBalance.toString()).to.be.equal("0");
  });

});
