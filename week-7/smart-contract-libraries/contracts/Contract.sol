// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "hardhat/console.sol";

contract Contract {
	function getSecret(string memory _message) public pure returns(uint) {
		console.log(_message);
		return 1337;
	}
}