/*
USAGE:

import attack from './attack.js';

characters = attack(player, enemy);

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

    return { player, enemy };
}