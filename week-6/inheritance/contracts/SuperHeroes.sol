// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./Hero.sol";

contract Mage is Hero(50) {
    function attack(address _enemy) public override {
        Enemy enemy = Enemy(_enemy);
        enemy.takeAttack(AttackTypes.Spell);
    }
}

contract Warrior is Hero(200) {
    function attack(address _enemy) public override {
        Enemy enemy = Enemy(_enemy);
        enemy.takeAttack(AttackTypes.Brawl);
    }
}

contract Mage1 is Hero1(50) {
    function attack(address _enemy) public override {
        Enemy1 enemy = Enemy1(_enemy);
        enemy.takeAttack(AttackTypes.Spell);
        super.attack(_enemy);
    }
}

contract Warrior1 is Hero1(200) {
    function attack(address _enemy) public override {
        Enemy1 enemy = Enemy1(_enemy);
        enemy.takeAttack(AttackTypes.Brawl);
        super.attack(_enemy);
    }
}