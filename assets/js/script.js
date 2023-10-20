// main variables

let potions
let ingredients
let cauldronIngredients = []
let playerStats = {
    strenght: 0,
    agility: 0,
    dexterity: 0,
    vitality: 0,
}
let opponents


// takes jason data and updates variables
fetch("/assets/json/potions.json")
    .then((response) => response.json())
    .then((json) => {
        components_data = json;
        potions = components_data.potions;
        ingredients = components_data.ingredients;
        opponents = components_data.opponents;
        console.log(potions, ingredients, opponents);
    });
    
    
// main load function
window.addEventListener("load", function () {
    
});