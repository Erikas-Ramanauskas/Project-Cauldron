/*
USAGE:

import applyPotion from './apply_potion.js';

character = applyPotion(character, potion);

*/

export default function applyPotion(character, potion) {
    character.strength += potion.strength;
    character.agility += potion.agility;
    character.dexterity += potion.dexterity;

    return character;
}