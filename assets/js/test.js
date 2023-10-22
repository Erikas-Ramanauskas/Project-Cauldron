import attack from './attack.js';
import applyPotion from './apply_potion.js';

let player = {
    "name": "Player",
    "picture": "assets/images/hero.png",
    "health": 50,
    "agility": 10,
    "strength": 10,
    "dexterity": 10
}
console.log(player);

let enemy = {
    "name": "Tiny Superhero",
    "health": 50,
    "agility": 15,
    "strength": 8,
    "dexterity": 10
}

console.log(enemy);

let potion = {
    id: 4,
    name: "Lunar Reverie Brew",
    ingredients: [
      "Unicorn Horn",
      "Phoenix Feather"
    ],
    strength: 10,
    dexterity: 5,
    agility: 5,
    picture: "assets/images/potions/lunar_reverie_brew.png"
}

player = applyPotion(player, potion);

console.log(player);
console.log(enemy);

player, enemy = attack(player, enemy);

console.log(player);
console.log(enemy);