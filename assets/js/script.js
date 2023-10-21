// main variables

let potions;
let ingredients;
let cauldronIngredients = [];
let playerStats = {
    strenght: 0,
    agility: 0,
    dexterity: 0,
    vitality: 0,
}

let villains
let gameturn = 0

// takes jason data and updates variables
fetch("https://erikas-ramanauskas.github.io/Project-Cauldron/assets/json/components_data.json")
    .then((response) => response.json())
    .then((json) => {
        components_data = json;
        potions = components_data.potions;
        ingredients = components_data.ingredients;
        villains = components_data.villains;

        // used as load function as variables are not loaded yet
        checkLocalStorage()
        selectvillain(0)
        createIngredientsInventory();
        createPotionsInventory();
        
        // testing
        addDiscoveredPotion(3)
        addDiscoveredPotion(4)
        addDiscoveredPotion(8)
        addDiscoveredPotion(5)
        addDiscoveredPotion(1)
        addDiscoveredPotion(22)
        addDiscoveredPotion(15)
        
    })
    .then(() => {
        // Initialize the tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    });


// Check if local storage has data and update variables for potions if they have been discovered
// turn this to function
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


// global functions
// random integer generator
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// update potions in local storage with new discovered potion passed in to function with potion id
function addDiscoveredPotion(potionID) {
  // Get the array of potions from local storage
  const potions = JSON.parse(localStorage.getItem('potions')) || [];

  if (potionID >= 0 && potionID < potions.length ) {
    // If the potion is found, set its "discovered" attribute to true
    potions[potionID].discovered = true;
  
    // Update the potions array in local storage
    localStorage.setItem('potions', JSON.stringify(potions));
  } else {
    console.log(`Potion with ID ${potionID} was not found.`);
  }
}



//  select random villain and display it's stats in html
function selectvillain(gameturn) {
    let villain = villains[getRandomInt(villains.length)];

    /*
    document.getElementById("villain-name").innerHTML = villain.name;
    document.getElementById("villain-image").src = villain.image;

    // villain stats
    strenght = villain.strenght + turn * villain.exraStrenght;
    agility = villain.agility + turn * villain.exraAgility;
    dexterity = villain.dexterity + turn * villain.exraDexterity;

    document.getElementById("villain-strenght").innerHTML = strenght;
    document.getElementById("villain-agility").innerHTML = agility;
    document.getElementById("villain-dexterity").innerHTML = dexterity;
    */
}

// adjust villain stats based on potion used
function adjustvillainStats(strenght, agility, dexterity) {
    /*
    document.getElementById("villain-strenght").innerHTML += strenght;
    document.getElementById("villain-agility").innerHTML += agility;
    document.getElementById("villain-dexterity").innerHTML += dexterity;
    */
}


// create ingredients inventory at the begining all items will have greyscaled-image class
function createIngredientsInventory() {
    let ingredientsInventory = document.getElementById("inventory-ingredients");
    const grid = document.createElement("div");
    grid.classList.add("row", "row-cols-4", "g-2");

    for (let i = 0; i < ingredients.length; i++) {
        let parent = document.createElement("div");
        let ingredient = document.createElement("img");

        ingredient.setAttribute("src", ingredients[i].picture);
        ingredient.setAttribute("alt", ingredients[i].name);
        ingredient.classList.add("greyscaled-image", "ingredient-img");

        parent.setAttribute("id", "ingredient-" + i);
        parent.classList.add("ingredient-container");
        parent.setAttribute("data-ingredient-id", i);
        parent.setAttribute("data-ingredient-ammount", 0);

        // tooltip
        parent.setAttribute("data-bs-toggle", "tooltip");
        parent.setAttribute("data-bs-placement", "top");
        parent.setAttribute("data-bs-title", ingredients[i].name);

        parent.appendChild(ingredient);

        grid.appendChild(parent);
    }
    ingredientsInventory.appendChild(grid);
}

// create potions inventory at the begining all items will have greyscaled-image class
function createPotionsInventory() {
    let potionsInventory = document.getElementById("inventory-potions");
    const grid = document.createElement("div");
    grid.classList.add("row", "row-cols-6", "g-2");

    for (let i = 0; i < 30; i++) {
        let parent = document.createElement("div");
        let potion = document.createElement("img");
        // checks if potion is discovered and if it is not image is not displayed
        console.log(potions[1].discovered);
        if (potions[i]?.discovered == undefined) {

        }
        else if (potions[i].discovered) {
            potion.setAttribute("src", potions[i].picture);
            potion.setAttribute("alt", potions[i].name);
            potion.classList.add("greyscaled-image", "potion-img");

            // // tooltip
            parent.setAttribute("data-bs-toggle", "tooltip");
            parent.setAttribute("data-bs-placement", "top");
            parent.setAttribute("data-bs-title", potions[i].name);
        }
        else {
            // change to unknown image later
            potion.setAttribute("src", "");
        }

        parent.classList.add("potion-container");
        parent.setAttribute("id", "potion-" + i);
        parent.setAttribute("data-potion-id", i);
        parent.setAttribute("data-potion-ammount", 0);
        parent.appendChild(potion);

        grid.appendChild(parent);
    }
    potionsInventory.appendChild(grid);
}


console.log("script.js loaded");