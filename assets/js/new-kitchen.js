"use strict";

let potions;
let ingredients;

fetch('assets/json/components_data.json')
    .then((response) => response.json())
    .then((json) => {
        let components_data = json;
        potions = components_data.potions;
        ingredients = components_data.ingredients;
        createIngredientInventory()
        addToIngredienstListHTML()
    })
    .then(() => {
        // Initialize the tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    });



// generate items for the potions inventory
function createIngredientInventory() {
    const ingredientsInventory = document.getElementById("ingredients-list");
    ingredientsInventory.innerHTML = "";

    // loop through brewed potions and add them to the potions inventory
    for (let i = 0; i < ingredients.length; i++) {
        let parent = document.createElement("div");
        let ingredient = document.createElement("img");

        ingredient.setAttribute("src", ingredients[i].picture);
        ingredient.setAttribute("alt", ingredients[i].name);
        ingredient.classList.add("ingredient-img", "dragable");

        parent.setAttribute("id", "ingredient-" + i);
        parent.classList.add("ingredient-container");
        parent.setAttribute("data-ingredient-id", i);
        parent.setAttribute("data-item", "ingredient");
        parent.setAttribute("data-ingredient-ammount", 0);

        // tooltip
        parent.setAttribute("data-bs-toggle", "tooltip");
        parent.setAttribute("data-bs-placement", "top");
        parent.setAttribute("data-bs-title", ingredients[i].name);

        parent.appendChild(ingredient);

        ingredientsInventory.appendChild(parent);
    }
}


// this function to be deleted but classes and structure to be done the same. 
// Used it to test out current ingredients
function addToIngredienstListHTML() {
    const ingredientsInventory = document.getElementById("recipie-ingredients");
    ingredientsInventory.innerHTML = "";

    // loop through brewed potions and add them to the potions inventory
    for (let i = 0; i < 5; i++) {
        let parent = document.createElement("div");
        let pictureFrame = document.createElement("div");
        let ingredient = document.createElement("img");
        let text = document.createElement("p");

        ingredient.setAttribute("src", ingredients[i].picture);
        ingredient.setAttribute("alt", ingredients[i].name);
        ingredient.classList.add("ingredient-img", "dragable");
        pictureFrame.appendChild(ingredient);

        parent.setAttribute("id", "ingredient-" + i);
        parent.classList.add("ingredient-for-recipie");
        parent.setAttribute("data-ingredient-id", i);
        parent.setAttribute("data-item", "ingredient");

        text.innerHTML = ingredients[i].name;

        parent.appendChild(pictureFrame);
        parent.appendChild(text);

        ingredientsInventory.appendChild(parent);
    }
}

