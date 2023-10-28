// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract Contract {
	uint public value;

	constructor(uint _value) {
		value = _value;
	}

    function modify(uint _value) external {
		value = _value;
	}
}

contract Token {
    mapping(address => uint) public balances;

    constructor() {
        balances[msg.sender] = 1000;
    }

    function transfer(address beneficiary, uint amount) external {
        require(balances[msg.sender] >= amount, "Balance too low!");
        balances[beneficiary] += amount;
        balances[msg.sender] -= amount;
    }
}

contract ContractMsg {
    address owner;
    string public message;

    constructor() {
        owner = msg.sender;
    }

    function modify(string calldata _message) external {
        require(msg.sender != owner, "Owner cannot modify the message!");
        message = _message;
    }
}

contract ContractDeposit {
    function deposit() payable external { }
}
