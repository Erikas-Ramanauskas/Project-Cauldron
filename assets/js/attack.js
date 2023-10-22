/*
USAGE:

import attack from './attack.js';

characters = attack(player, enemy);

returns true if game won, false if game lost, else returns new character data

*/

export default function attack(player, enemy) {
    let playerAttack = (player.agility + player.strength + player.dexterity) - (enemy.agility + enemy.strength + enemy.dexterity);
    let enemyAttack = (enemy.agility + enemy.strength + enemy.dexterity) - (player.agility + player.strength + player.dexterity);

    if (playerAttack > 0) {
        enemy.health -= playerAttack;
    }
    if (enemyAttack > 0) {
        player.health -= enemyAttack;
    }

    if (enemy.health <= 0) {
        return true;
    } else if (player.health <= 0) {
        return false;
    } else {
        return { player, enemy };
    }
}