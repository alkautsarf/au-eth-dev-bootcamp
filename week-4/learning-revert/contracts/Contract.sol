// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


contract Contract {
    address public owner;
    error NotOwner();
    constructor() payable {
        require(msg.value >= 1 ether, "Require a Minimum of 1 Ether Deposit");
        owner = msg.sender;
    }

    function withdraw() public {
        if(msg.sender != owner) {
            revert NotOwner();
        }
        (bool s,) = owner.call{ value: address(this).balance}("");
        require(s);
    }
}

contract ContractModifier {
	address owner;
	uint configA;
	uint configB;
	uint configC;

	constructor() {
		owner = msg.sender;
	}

	function setA(uint _configA) public onlyOwner {
		configA = _configA;
	}

	function setB(uint _configB) public onlyOwner {
		configB = _configB;
	}

	function setC(uint _configC) public onlyOwner {
		configC = _configC;
	}

	modifier onlyOwner {
		// TODO: require only the owner access
		require(msg.sender == owner);
		_;
		// TODO: run the rest of the function body

	}
}