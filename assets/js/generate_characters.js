/*

!!
MAKE SURE TO SPECIFY TYPE="MODULE" IN HTML SCRIPT TAG:
    <script type="module" src="scrip.js"></script>
!!

USAGE:

import generateCharacters from './generate_characters.js';

generateCharacters(difficulty)
    .then(characters => {
        [ APPLY LOGIC HERE ]
    })

RETURNS:

{
    "player": {
        "name": "Player",
        "picture": "assets/images/hero.png",
        "health": 50, // default health is 50
        "agility": 10,
        "strength": 10,
        "dexterity": 10
    },
    "enemy": {
        "name": "Tiny Superhero",
        "picture": villain.picture,
        "health": 50, // default health is 50
        "agility": 15,
        "strength": 8,
        "dexterity": 10
    }
}
*/

import fetchData from './fetch_data.js';
const potionLimit = 10;
let componentsData;

const playerStats = {
    health: 100,
    strength: 10,
    agility: 10,
    dexterity: 10,
}

export default function generateCharacters(difficulty) {
    return fetchData().then(data => {
        componentsData = data;
        return generateObjects(difficulty);
    });
}

function getPotions() {
    let potionIds = [];
    let potions = [];

    while (potionIds.length < potionLimit) {
        let randomInt = Math.floor(Math.random() * componentsData.potions.length);
        if (!potionIds.includes(randomInt)) {
            potionIds.push(randomInt);
        }
    }

    for (let id of potionIds) {
        let potion = componentsData.potions.find(potion => parseInt(potion.id) === id);
        potions.push(potion);
    }

    return potions;
}

function calculateEnemyStats(playerStats, randomPotions, difficulty) {

    let enemyStats = { ...playerStats };

    for (let potion of randomPotions) {
        enemyStats.strength += potion.strength * difficulty;
        enemyStats.agility += potion.agility * difficulty;
        enemyStats.dexterity += potion.dexterity * difficulty;
    }

    return enemyStats;
}

function generateObjects(difficulty) {
    let randomPotions = getPotions();
    let enemyStats = calculateEnemyStats(playerStats, randomPotions, difficulty);
    let villain = componentsData.villains[Math.floor(Math.random() * componentsData.villains.length)];
    let enemy = {
        name: villain.name,
        picture: villain.picture,
        health: 50,
        agility: enemyStats.agility,
        strength: enemyStats.strength,
        dexterity: enemyStats.dexterity
    }
    let player = {
        name: 'Player',
        health: 50,
        picture: 'assets/images/hero.png',
        agility: playerStats.agility,
        strength: playerStats.strength,
        dexterity: playerStats.dexterity
    }

    return {
        player,
        enemy
    }
}