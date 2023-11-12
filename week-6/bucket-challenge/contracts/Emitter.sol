// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

interface Bucket {
    function drop(address erc20, uint amount) external;
}

contract ContractEmitter {
    function confirm(address _contract, address _token) external {
        console.log(_contract, _token);
        bool s = IERC20(_token).approve(_contract, 1e18);
        require(s, "Approval Failed");
    }

    function call(address _contract, address _token, uint _amount) external {
        Bucket(_contract).drop(_token, _amount);
    }
}
