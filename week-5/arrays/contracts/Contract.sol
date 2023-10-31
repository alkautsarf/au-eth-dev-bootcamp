// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Contract {
    function sum(uint[5] memory args) external pure returns(uint _sum) {
        for(uint i = 0; i < args.length; i++) {
            _sum += args[i];
        }
        return _sum;
    }
}

contract Contract2 {
    function sum(uint[] calldata args) external pure returns(uint _sum) {
        for(uint i = 0; i < args.length; i++) {
            _sum += args[i];
        }
        return _sum;
    }
}

contract Contract3 {
    uint[] public evenNumbers;

    function filterEven(uint[] memory args) external {
        for(uint i = 0; i < args.length; i++) {
            if(args[i] % 2 == 0) {
                evenNumbers.push(args[i]);
            }
        }
    }
}
// manual push for memory array
contract Contract4 {
    function filterEven(uint[] memory args) external pure returns(uint[] memory) {
        uint element;

        for(uint i = 0; i < args.length; i++) {
            if(args[i] % 2 == 0) {
                element++;
            }
        }
        uint[] memory sum = new uint[](element);
        uint idx = 0;
        for(uint i = 0; i < args.length; i++) {
            if(args[i] % 2 == 0) {
                sum[idx] = args[i];
                idx++;
            }
        }
        return sum;

    }
}

contract StackClub {
    address[] public members;

    function addMember(address _address) external {
        members.push(_address);
    }

    function isMember(address _address) public view returns(bool) {
        for(uint i = 0; i < members.length; i++) {
            if(members[i] == _address) {
                return true;
            }
        }
        return false;
    }
}

contract StackClubSecure {
    address[] public members;

    constructor() {
        members.push(msg.sender);
    }

    modifier check {
        bool valid;
        for(uint i = 0; i < members.length; i++) {
            if(members[i] == msg.sender) {
                valid = true;
            }
        }
        require(valid == true);
        _;
    }

    function addMember(address _address) external check {
        members.push(_address);
    }

    function isMember(address _address) public view returns(bool) {
        for(uint i = 0; i < members.length; i++) {
            if(members[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function removeLastMember() external check {
        members.pop();
    }
}