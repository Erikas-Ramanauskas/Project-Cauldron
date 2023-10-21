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

// takes jason data and updates variables
fetch("/assets/json/components_data.json")
    .then((response) => response.json())
    .then((json) => {
        components_data = json;
        potions = components_data.potions;
        ingredients = components_data.ingredients;
        villains = components_data.villains;
        checkLocalStorage()
        
        // used as load function as variables are not loaded yet
        selectvillain(0)
        createIngredientsInventory();
        createPotionsInventory();
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

  // Find the potion by its "id" attribute
  const potionIndex = potions.findIndex((potion) => potion.id === potionID);

  if (potionIndex !== -1) {
    // If the potion is found, set its "discovered" attribute to true
    potions[potionIndex].discovered = true;

    // Update the potions array in local storage
    localStorage.setItem('potions', JSON.stringify(potions));
    console.log(`Potion with ID ${potionID} has been discovered.`);
  } else {
    console.log(`Potion with ID ${potionID} was not found.`);
  }
}



//  select random villain and display it's stats in html
function selectvillain(turn) { 
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
    for (let i = 0; i < ingredients.length; i++) {
        let parent = document.createElement("div");
        let ingredient = document.createElement("img");
        ingredient.setAttribute("src", ingredients[i].picture);
        ingredient.setAttribute("class", "greyscaled-image");
        parent.setAttribute("data-ingredient-id", i);
        parent.setAttribute("data-ingredient-ammount", 0);
        parent.appendChild(ingredient);
        ingredientsInventory.appendChild(parent);
    }  
}

// create potions inventory at the begining all items will have greyscaled-image class
function createPotionsInventory() {
    let potionsInventory = document.getElementById("inventory-potions");
    for (let i = 0; i < 30; i++) {
        let parent = document.createElement("div");
        let potion = document.createElement("img");
        parent.setAttribute("class", "potion-container");
        // checks if potion is discovered and if it is not image is not displayed
        console.log(potions[1].discovered);
        if (potions[i]?.discovered == undefined) {
       
        }
        else if (potions[i].discovered) {
                potion.setAttribute("src", potions[i].image);
            potion.setAttribute("class", "greyscaled-image");
        }
        else {
            // change to unknown image later
            potion.setAttribute("src", "");
        }
        parent.setAttribute("id", "potion-" + i);
        parent.setAttribute("data-potion-id", i);
        parent.setAttribute("data-potion-ammount", 0);
        parent.appendChild(potion); 
        potionsInventory.appendChild(parent);
    }  
}


console.log("script.js loaded");