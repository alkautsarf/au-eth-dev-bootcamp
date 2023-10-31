// add the game address here and update the contract name if necessary
const main = require("./deploy");
const contractName = "Game";

async function win() {
  // attach to the game
  const addresses = await main();

  for (let i = 0; i < addresses.length; i++) {
    const gameAddr = addresses[i];
    if (i == 0) {
      const game = await hre.ethers.getContractAt(
        `${contractName}${i + 1}`,
        gameAddr
      );

      const tx = await game.win();

      const receipt = await tx.wait();
      console.log(receipt);
    }
    if (i == 1) {
      const game = await hre.ethers.getContractAt(
        `${contractName}${i + 1}`,
        gameAddr
      );
      
      const setX = await game.setX(25);
      await setX.wait();
      const setY = await game.setY(25);
      await setY.wait();

      const tx = await game.win();

      const receipt = await tx.wait();
      console.log(receipt);
    }
    if(i == 2) {
      const game = await hre.ethers.getContractAt(
        `${contractName}${i + 1}`,
        gameAddr
      )
      const tx = await game.win(45);

      const receipt = await tx.wait();
      console.log(receipt);
    }
    if(i == 3) {
      const game = await hre.ethers.getContractAt(
        `${contractName}${i + 1}`,
        gameAddr
      )
      const tx = await game.win(56);

      const receipt = await tx.wait();
      console.log(receipt);
    }
    if(i == 4) {
      const game = await hre.ethers.getContractAt(
        `${contractName}${i + 1}`,
        gameAddr
      )
      const allowance = await game.giveMeAllowance(10001);
      await allowance.wait();

      const mint = await game.mint(10000)
      await mint.wait();

      const tx = await game.win();
      const receipt = await tx.wait();
      console.log(receipt);
    }
  }
}

win()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
