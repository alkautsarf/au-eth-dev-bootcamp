//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./UintFunctions.sol";

contract Game {
    uint public participants;
    bool public allowTeams;
    using UintFunctions for uint;


    constructor(uint _participants) {
        participants = _participants;
        if(_participants.isEven()) allowTeams = true;
        else allowTeams = false;
    }
}

//! First Usage Example

// contract Example {
//     function isEven(uint x) public pure returns(bool) {
//         return UintFunctions.isEven(x);
//     }
// }

//! Second Usage Example

// contract Example {
//     using UIntFunctions for uint;
//     function isEven(uint x) public pure returns(bool) {
//         return x.isEven();
//     }
// }