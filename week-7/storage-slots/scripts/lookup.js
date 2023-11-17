const hre = require('hardhat')
const addr = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'
const {hexZeroPad, keccak256, toUtf8Bytes} = hre.ethers.utils

async function lookup() {
    const [address] = await hre.ethers.getSigners()

    const key = hexZeroPad(address.address, 32)
    const baseSlot = hexZeroPad(1, 32).slice(2);
    const slot = keccak256(key + baseSlot)
    const storageSlot = keccak256(toUtf8Bytes('elpabl0'));

    const value = await hre.ethers.provider.getStorageAt(addr, '0x0')
    const valueMapping = await hre.ethers.provider.getStorageAt(addr, slot)
    const valueStorage = await hre.ethers.provider.getStorageAt(addr, storageSlot)

    const valueStorageRead = await hre.ethers.getContractAt('Storage', addr)
    await valueStorageRead.check();

    console.log({
        value: parseInt(value),
        valueMapping: parseInt(valueMapping),
        valueStorage: parseInt(valueStorage),
    });
}

lookup();