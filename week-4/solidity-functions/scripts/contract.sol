// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    uint public x;
    constructor(uint _x) {
        x = _x;
    }

    function increment() external {
        x++;
    }

    function add(uint _x) external view returns(uint) {
        return _x + x;
    }

    function double(uint _x) external pure returns(uint sum) {
        sum = _x * 2;
    }

    function double(uint _x, uint _y) external pure returns(uint, uint) {
        return (_x * 2, _y * 2);
    }
}