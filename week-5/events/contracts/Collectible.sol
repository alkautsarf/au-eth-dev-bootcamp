// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Collectible {
    event Deployed(address indexed);
    event Transfer(address indexed _ogOwner, address indexed _newOwner);
    event ForSale(uint _price, uint _block);
    event Purchase(uint _amount, address indexed _address);

    address public owner;
    uint public askingPrice;

    constructor() {
        emit Deployed(msg.sender);
        owner = msg.sender;
    }

    function transfer(address _address) external {
        require(msg.sender == owner);
        emit Transfer(owner, _address);
        owner = _address;
    }

    function markPrice(uint _price) external {
        require(msg.sender == owner);
        askingPrice = _price;
        emit ForSale(_price, block.timestamp);
    } 

    function purchase() external payable {
        require(askingPrice > 0 && msg.value == askingPrice);
        (bool s,) = owner.call{value : msg.value}("");
        require(s);
        owner = msg.sender;
        emit Purchase(askingPrice, msg.sender);
        askingPrice = 0;
    }
}
