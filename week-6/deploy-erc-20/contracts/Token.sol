// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    uint constant _initial_supply = 1 * (10**18);
    constructor() ERC20("Pabl0", "Pabl0") {
        _mint(msg.sender, _initial_supply);
    }
}
