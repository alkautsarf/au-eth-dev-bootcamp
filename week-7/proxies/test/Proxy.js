const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { assert } = require("chai");

describe("Proxies", function () {
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Proxy = await ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy();

    const Logic1 = await ethers.getContractFactory("Logic1");
    const logic1 = await Logic1.deploy();

    const Logic2 = await ethers.getContractFactory("Logic2");
    const logic2 = await Logic2.deploy();

    const proxyAsLogic1 = await ethers.getContractAt('Logic1', proxy.address);
    const proxyAsLogic2 = await ethers.getContractAt('Logic2', proxy.address);

    return { proxy, logic1, logic2, proxyAsLogic1, proxyAsLogic2};
  }

  async function lookupUint(contractAddr, slot) {
    return parseInt(await ethers.provider.getStorageAt(contractAddr, slot));
  }

  it("should work with logic1", async function () {
    const { proxy, logic1, proxyAsLogic1 } = await loadFixture(deploy);

    await proxy.changeImplementation(logic1.address);

    assert.equal(await lookupUint(proxy.address, "0x0"), 0)

    await proxyAsLogic1.changeX(45);

    assert.equal(await lookupUint(proxy.address, "0x0"), 45)
  })

  it("should work with logic2", async function () {
    const { proxy, logic1, proxyAsLogic1, logic2, proxyAsLogic2 } = await loadFixture(deploy);

    await proxy.changeImplementation(logic1.address);

    assert.equal(await lookupUint(proxy.address, "0x0"), 0)

    await proxyAsLogic1.changeX(45);

    assert.equal(await lookupUint(proxy.address, "0x0"), 45)
    assert.equal(await lookupUint(logic1.address, "0x0"), 0)

    await proxy.changeImplementation(logic2.address);

    await proxyAsLogic2.changeX(77);

    assert.equal(await lookupUint(proxy.address, "0x0"), 77)

    await proxyAsLogic2.tripleX();

    assert.equal(await lookupUint(proxy.address, "0x0"), 77 * 3)
  })
});
