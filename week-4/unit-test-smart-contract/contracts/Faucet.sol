// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Faucet {
  address payable public owner;

  constructor() payable {
    owner = payable(msg.sender);
  }
  
  function withdraw(uint _amount) payable public {
    // users can only withdraw .1 ETH at a time, feel free to change this!
    require(_amount <= 100000000000000000);
    (bool sent, ) = payable(msg.sender).call{value: _amount}("");
    require(sent, "Failed to send Ether");
  }

  function withdrawAll() onlyOwner public {
    (bool sent, ) = owner.call{value: address(this).balance}("");
    require(sent, "Failed to send Ether");
  }

  function destroyFaucet() onlyOwner public {
    selfdestruct(owner);
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function balance() public view returns(uint _balance) {
    _balance = address(this).balance;
  }
}
