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
    return JSON.parse(localStorage.getItem("inventory"));
}

export function resetInventory() {
    localStorage.removeItem("inventory");
    createInventory();
}

export function addToInventory(potion) {
    let inventory = getInventory();
    inventory.push(potion);
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

export function removeFromInventory(potion) {
    let inventory = getInventory();
    inventory = inventory.filter(item => item.id !== potion.id);
    localStorage.setItem("inventory", JSON.stringify(inventory));
}