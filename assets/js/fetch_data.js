/* 
Usage:

import fetch_data from './fetch_data.js';
const components_data = fetch_data();

Returns js object of components_data.json:

{
    potions: [
        {
            name: "potion name",
            discovered: true,
            picture: "path to picture",
            ingredients: [
                {
                    name: "ingredient name",
                    name: "ingredient name",
                }
            ]
            agility: 10,
            dexterity: 10,
            strength: 10,
        }
    ],
    ingredients: [
        {
            name: "ingredient name",
            picture: "path to picture"
        }
    ],
    villians: [
        {
            name: "villian name",
            picture: "path to picture",
            strength: 10,
            agility: 10,
            dexterity: 10
        }
*/

let potions;
let ingredients;
let villians;

function checkLocalStorage() {
    if (localStorage.getItem("potions") !== null) {
        let discoveredPotions = JSON.parse(localStorage.getItem("potions"));
        potions = discoveredPotions;
    }
    // if local storage is empty, set all potions to undiscovered and save to local storage
    else {
        for (let i = 0; i < potions.length; i++) {
            potions[i].discovered = false;
        }
        localStorage.setItem("potions", JSON.stringify(potions));
    }
}

// export default function fetch_data() {
//     // fetch data from json file
//     fetch("https://erikas-ramanauskas.github.io/Project-Cauldron/assets/json/components_data.json")
//             .then((response) => response.json())
//             .then((json) => {

//                 const componentsData = json;
//                 const potions = componentsData.potions;
//                 const ingredients = componentsData.ingredients;
//                 const villians = componentsData.villians;

//                 checkLocalStorage()
//     });
    
//     return {
//         potions: potions,
//         ingredients: ingredients,
//         villians: villians
//     }
// }

// let componentsData = fetch_data();
// console.log(componentsData);

async function fetch_data() {
    try {
        const response = await fetch("https://erikas-ramanauskas.github.io/Project-Cauldron/assets/json/components_data.json");
        const json = await response.json();

        const componentsData = json;
        const potions = componentsData.potions;
        const ingredients = componentsData.ingredients;
        const villains = componentsData.villains;

        return {
            potions,
            ingredients,
            villains
        };
    } catch (error) {
        console.error("An error occurred while fetching data:", error);
        return null;
    }
}

export default async function fetchData() {
    const componentsData = await fetch_data();
    return componentsData;
}