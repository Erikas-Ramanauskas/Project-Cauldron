/*
USAGE:

import attack from './attack.js';

characters = attack(player, enemy);

returns true if game won, false if game lost, else returns new character data

*/

export default function attack(player, enemy) {
    // let playerAttack = (player.agility + player.strength + player.dexterity) - (enemy.agility + enemy.strength + enemy.dexterity);
    let playerAttack1 = player.agility - enemy.agility;
    let playerAttack2 = player.strength - enemy.strength;
    let playerAttack3 = player.dexterity - enemy.dexterity;
    let enemyAttack1 = enemy.agility - player.agility;
    let enemyAttack2 = enemy.strength - player.strength;
    let enemyAttack3 = enemy.dexterity - player.dexterity;
    // let enemyAttack = (enemy.agility + enemy.strength + enemy.dexterity) - (player.agility + player.strength + player.dexterity);

    if (playerAttack1 > 0) {
        enemy.health -= playerAttack1;
    }
    if (playerAttack2 > 0) {
        enemy.health -= playerAttack2;
    }
    if (playerAttack3 > 0) {
        enemy.health -= playerAttack3;
    }
    if (enemyAttack1 > 0) {
        player.health -= enemyAttack1;
    }
    if (enemyAttack2 > 0) {
        player.health -= enemyAttack2;
    }
    if (enemyAttack3 > 0) {
        player.health -= enemyAttack3;
    }

    if (enemy.health <= 0) {
        return true;
    } else if (player.health <= 0) {
        return false;
    } else {
        return { player, enemy };
    }
}