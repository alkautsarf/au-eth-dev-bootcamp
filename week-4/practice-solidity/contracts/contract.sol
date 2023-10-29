// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract SumAndAverage {
    
    function sumAndAverage(uint a, uint b, uint c, uint d) external pure returns(uint sum, uint average){
        sum = a + b + c + d;
        average = sum / 4;
    }
}

contract Countdown {

    uint public i = 0;
    
    function tick() external {
        i++;
        if(i == 10) {
            selfdestruct(payable(address(msg.sender)));
        }
    }
}