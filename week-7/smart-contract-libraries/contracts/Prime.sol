// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

library Prime {
    function dividesEvenly(uint _number1, uint _number2) public pure returns(bool) {
        return (_number1 % _number2 == 0);
    }

    function isPrime(uint x) public pure returns(bool) {
		for(uint i = 2; i <= x / 2; i++) {
			if(dividesEvenly(x, i)) {
				return false;
			}
		}
		return true;
	}
}