// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface Enemy {
	function takeAttack(Hero.AttackTypes attackType) external;
}

abstract contract Hero {
	uint public health;
	constructor(uint _health) {
		health = _health;
	}
	
	function takeDamage(uint damage) external {
		health -= damage;
	}
	
	enum AttackTypes { Brawl, Spell }
	function attack(address enemy) public virtual;
}

interface Enemy1 {
	function takeAttack(Hero1.AttackTypes attackType) external;
}

contract Hero1 {
	uint public health;
	uint public energy = 10;
	constructor(uint _health) {
		health = _health;
	}

	enum AttackTypes { Brawl, Spell }
	function attack(address) public virtual {
		energy--;
	}
}
