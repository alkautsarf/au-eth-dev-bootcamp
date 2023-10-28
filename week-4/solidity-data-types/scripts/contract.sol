// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract ContractBool {
	bool public a = true;
	bool public b = false;
}

contract ContractUint {
    uint8 public a = 77;
    uint16 public b = 7777;
    uint256 public sum = a + b;
}

contract ContractInt {
    int8 public a = 77;
    int8 public b = -7;
    int16 public difference = a - b;
}

contract ContractString {
	bytes32 public msg1 = "Hello World";
    string public msg2 = "Helo my name is alkautsar and I'm a student in Alchemy University";
}

contract ContractEnum {
    enum Foods { Apple, Pizza, Bagel, Banana }

	Foods public food1 = Foods.Apple;
	Foods public food2 = Foods.Pizza;
	Foods public food3 = Foods.Bagel;
	Foods public food4 = Foods.Banana;
}