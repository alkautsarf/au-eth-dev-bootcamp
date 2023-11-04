// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Party {
    uint public deposit;
    address[] members;
    mapping(address => bool) public addresses;

    constructor(uint _deposit) payable {
        deposit = _deposit;
    }

    function rsvp() external payable {
        require(
            msg.value == deposit && addresses[msg.sender] == false,
            "Insufficient Deposit"
        );
        addresses[msg.sender] = true;
        members.push(msg.sender);
    }

    function payBill(address _address, uint _total) external {
        (bool s, ) = _address.call{value: _total}("");
        require(s);
        uint remainder = address(this).balance / members.length;
        for (uint i = 0; i < members.length; i++) {
            (bool _s, ) = members[i].call{value: remainder}("");
            require(_s);
        }
    }
}
