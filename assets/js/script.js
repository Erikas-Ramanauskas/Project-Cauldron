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
let vilains


// takes jason data and updates variables
fetch("/assets/json/potions.json")
    .then((response) => response.json())
    .then((json) => {
        components_data = json;
        potions = components_data.potions;
        ingredients = components_data.ingredients;
        vilains = components_data.vilains;
        checkLocalStorage()
        
        // used as load function as variables are not loaded yet
        selectVilain(0)
        
    });
    
    
// Check if local storage has data and update variables for potions if they have been discovered
// turn this to function
function checkLocalStorage() {
    if (localStorage.getItem("potions") !== null) {
        let discoveredPotions = JSON.parse(localStorage.getItem("potions"));
        for (let i = 0; i < discoveredPotions.length; i++) {
            potions[i].discovered = discoveredPotions[i];
        }
    }
    // if local storage is empty, set all potions to undiscovered and save to local storage
    else {
        for (let i = 0; i < potions.length; i++) {
            potions[i].discovered = false;
        }
        localStorage.setItem("potions", JSON.stringify(potions));
    }
}

    
// main load function that is called to set up the enviroment in html file
window.addEventListener("load", function () {
    createIngredientsInventory();
    createPotionsInventory();
});



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



//  select random vilain and display it's stats in html
function selectVilain(turn) { 
    let vilain = vilain[getRandomInt(vilains.length)];
    document.getElementById("vilain-name").innerHTML = vilain.name;
    document.getElementById("vilain-image").src = vilain.image; 
    
    // vilain stats
    strenght = vilain.strenght + turn * vilain.exraStrenght;
    agility = vilain.agility + turn * vilain.exraAgility;
    dexterity = vilain.dexterity + turn * vilain.exraDexterity;
    
    document.getElementById("vilain-strenght").innerHTML = strenght;
    document.getElementById("vilain-agility").innerHTML = agility;
    document.getElementById("vilain-dexterity").innerHTML = dexterity;
}

// adjust vilain stats based on potion used
function adjustVilainStats(strenght, agility, dexterity) {
    document.getElementById("vilain-strenght").innerHTML += strenght;
    document.getElementById("vilain-agility").innerHTML += agility;
    document.getElementById("vilain-dexterity").innerHTML += dexterity;
}


// create ingredients inventory at the begining all items will have greyscaled-image class
function createIngredientsInventory() {
    let ingredientsInventory = document.getElementById("ingredients-inventory");
    for (let i = 0; i < ingredients.length; i++) {
        let ingredient = document.createElement("img");
        ingredient.setAttribute("src", ingredients[i].image);
        ingredient.setAttribute("class", "greyscaled-image");
        ingredient.setAttribute("data-ingredient-id", ingredients[i].id);
        ingredient.setAttribute("data-ingredient-ammount", ingredients[i].ammount);
        ingredientsInventory.appendChild(ingredient);
    }  
}