// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

library UintFunctions {
    function isEven(uint _number) public pure returns(bool) {
        return _number % 2 == 0;
    }
}