// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IERC20.sol";

contract Chest {
    function plunder(address[] memory _address) external {
        for (uint i = 0; i < _address.length; i++) {
            uint balance = IERC20(_address[i]).balanceOf(address(this));
            IERC20(_address[i]).transfer(msg.sender, balance);
        }
    }
}
