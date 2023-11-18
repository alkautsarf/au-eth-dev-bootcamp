// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./Prime.sol";
import "hardhat/console.sol";


contract PrimeGame {
    using Prime for uint;

    function isWinner() public view returns(bool) {
        console.log(block.number);
        return block.number.isPrime();
    }
}