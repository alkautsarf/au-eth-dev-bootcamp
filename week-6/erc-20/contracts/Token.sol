// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Token {
    uint public totalSupply;
    string public name = "Alchemy";
    string public symbol = "ALC";
    uint8 public decimals = 18;

    mapping(address => uint) balance;

    constructor() {
        totalSupply = 1000 * (10 ** 18);
        balance[msg.sender] = totalSupply;
    }

    function balanceOf(address _address) external view returns (uint) {
        return balance[_address];
    }

    event Transfer(
        address indexed sender,
        address indexed receiver,
        uint amount
    );

    function transfer(address _address, uint _amount) public returns (bool) {
        require(balance[msg.sender] >= _amount, "Insufficient Balance");
        balance[msg.sender] -= _amount;
        balance[_address] += _amount;
        emit Transfer(msg.sender, _address, _amount);
        return true;
    }
}
