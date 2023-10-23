// main variables

let potions;
let ingredients;
let cauldronIngredients = [];
let playerStats = {
    strength: 3,
    agility: 3,
    dexterity: 3,
    vitality: 20,
}

// vilains array 
let villains
// current villain stats
let villainStats = {
    strength: 4,
    agility: 4,
    dexterity: 4
}
let gameturn = 0

// takes jason data and updates variables

fetch('assets/json/components_data.json')
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


// random integer generator
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
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
    let villain = villains[getRandomInt(0, villains.length)];

    /*
    document.getElementById("villain-name").innerHTML = villain.name;
    document.getElementById("villain-image").src = villain.image;

    // villain stats
    strength = villain.strength + turn * villain.exrastrength;
    agility = villain.agility + turn * villain.exraAgility;
    dexterity = villain.dexterity + turn * villain.exraDexterity;

    document.getElementById("villain-strength").innerHTML = strength;
    document.getElementById("villain-agility").innerHTML = agility;
    document.getElementById("villain-dexterity").innerHTML = dexterity;
    */
}



// create ingredients inventory at the begining all items will have greyscaled-image class
function createIngredientsInventory() {
    let ingredientsInventory = document.getElementById("inventory-ingredients");


    for (let i = 0; i < ingredients.length; i++) {
        let parent = document.createElement("div");
        let ingredient = document.createElement("img");

        ingredient.setAttribute("src", ingredients[i].picture);
        ingredient.setAttribute("alt", ingredients[i].name);
        ingredient.classList.add("greyscaled-image", "ingredient-img", "dragable");

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

// create potions inventory at the begining all items will have greyscaled-image class
function createPotionsInventory() {
    let potionsInventory = document.getElementById("inventory-potions");
   

    for (let i = 0; i < potions.length; i++) {
        let parent = document.createElement("div");
        let potion = document.createElement("img");
        // checks if potion is discovered and if it is not image is not displayed
        if (potions[i].discovered) {
            potion.setAttribute("src", potions[i].picture);
            potion.setAttribute("alt", potions[i].name);
            potion.classList.add("greyscaled-image", "potion-img", "dragable");

            // // tooltip
            parent.setAttribute("data-bs-html", true);
            parent.setAttribute("data-bs-toggle", "tooltip");
            parent.setAttribute("data-bs-placement", "top");
            const tooltip = `
            ${potions[i].name}<br>
            <span class="text-danger">Strength</span>: ${potions[i].strength}<br>
            <span class="text-success">Agility</span>: ${potions[i].agility}<br>
            <span class="text-info">Dexterity</span>: ${potions[i].dexterity}
            `
            parent.setAttribute("data-bs-title", tooltip);    
        }
        else {
            // change to unknown image later
            potion.setAttribute("src", "assets/images/potions/unknown_potion.png");
            potion.classList.add("potion-img");
        }

        parent.classList.add("potion-container");
        parent.setAttribute("id", "potion-" + i);
        parent.setAttribute("data-potion-id", i);
        parent.setAttribute("data-item", "potion");
        parent.setAttribute("data-potion-ammount", 0);
        parent.appendChild(potion);

        potionsInventory.appendChild(parent);
    }
    addNewEventListeners("add")
}