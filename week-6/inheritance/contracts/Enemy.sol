// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract EnemyContract {
    address public enemy;
    enum AttackTypes { Brawl, Spell }
    constructor(address _enemy) {
        enemy = _enemy;
    }
    event EnemyAttacked(AttackTypes attackType,string message);
    function takeAttack(AttackTypes attackType) external {
        emit EnemyAttacked(attackType, "Attacked");
    }
}