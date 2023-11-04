// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Switch {
    address public recipient;
    address owner;
    uint interaction;
    constructor(address _address) payable {
        recipient = _address;
        owner = msg.sender;
        interaction = block.timestamp;
    }

    function withdraw() external {
        require((block.timestamp - interaction) >= 52 weeks);
        (bool s,) = recipient.call{value: address(this).balance}("");
        require(s);
    }

    function ping() external {
        require(owner == msg.sender, "You are not the owner");
        interaction = block.timestamp;
        
    }
}