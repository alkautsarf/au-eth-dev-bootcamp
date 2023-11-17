// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import './StorageSlot.sol';
import "hardhat/console.sol";

contract Storage {
    uint x = 256;

    mapping(address => uint) balances;

    constructor() {
        balances[msg.sender] = x;
        StorageSlot.getUint256Slot(keccak256("elpabl0")).value = 77;
    }

    function check() external view {
        console.log(StorageSlot.getUint256Slot(keccak256("elpabl0")).value);
    }
}
