/*
USAGE:

import { createInventory, resetInventory, getInventory, addToInventory, removeFromInventory } from "./inventory.js";

createInventory();
resetInventory();
addToInventory(potion);
getInventory();
removeFromInventory(potion);

*/

export function createInventory() {
    let inventory = [];
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

export function getInventory() {
    let inventory = JSON.parse(localStorage.getItem("inventory"));
    if (!inventory) {
        createInventory();
        inventory = [];
    }
    return inventory;
}

export function resetInventory() {
    localStorage.removeItem("inventory");
    createInventory();
}

export function addToInventory(potion) {
    let inventory = getInventory();

    // Check if the potion is already in the inventory
    let existingPotion = inventory.find(item => item.id === potion.id);

    if (existingPotion) {
        // If found, increment its amount
        existingPotion.amount = (existingPotion.amount || 0) + 1;
    } else {
        // If not, add the potion to the inventory with an amount of 1
        potion.amount = 1;
        inventory.push(potion);
    }

    localStorage.setItem("inventory", JSON.stringify(inventory));
}

export function removeFromInventory(potionId) {
    let inventory = getInventory();

    // Find the potion with the provided ID
    let existingPotion = inventory.find(item => item.id === potionId);

    if (existingPotion) {
        // Decrement its amount
        existingPotion.amount -= 1;

        // If amount reaches 0 or below, filter it out of the inventory
        if (existingPotion.amount <= 0) {
            inventory = inventory.filter(item => item.id !== potionId);
        }
    }

    localStorage.setItem("inventory", JSON.stringify(inventory));
}