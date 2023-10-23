// For Code institute Assesment
// this file is left for further development but currently is not in use


let cauldronContents = [];
let potions;
let ingredients;

document.addEventListener("DOMContentLoaded", function () {
    const ingredientElements = document.querySelectorAll('.ingredient');

    // parse json file
    fetch('assets/json/components_data.json')
        .then((response) => response.json())
        .then((json) => {

            const componentsData = json;
            potions = componentsData.potions;
            ingredients = componentsData.ingredients;

           
            checkLocalStorage()
            createIngredientInventory();
            addNewEventListeners("add")
    });

    document.querySelector('.cauldron').addEventListener('click', function () {
        brewPotion(potions, cauldronContents);
    });

    document.querySelector('#recipie-book-img-container').addEventListener('click', function () {
        showRecipeBook();
    });

});

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

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Sort the arrays
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }

    return true;
}

const dropdownAlert = document.querySelector('.dropdown-alert');
const dropdownAlertText = document.querySelector('.dropdown-alert-text');

function brewPotion(potions, cauldronContents) {
    // play 3 seconds of sound
    const audio = new Audio('assets/sounds/bubbling.wav');
    makeIngredientsNotDraggable();

    // change the cauldron gif to cauldron-brew.gif
    const cauldron = document.querySelector('.cauldron');
    document.querySelector('#couldron-img').setAttribute('src', 'assets/images/general/cauldron_brew.gif')
    audio.play();
    // wait 3 seconds
    setTimeout(function () {
        // change the cauldron gif to cauldron.gif
        audio.pause();
        document.querySelector('#couldron-img').setAttribute('src', 'assets/images/general/cauldron.gif')
    }, 2500);

    for(let potion of potions) {

        if(arraysEqual(potion.ingredients, cauldronContents)) {
            let potionsBrewed = JSON.parse(localStorage.getItem("potionsBrewed"));
            if (!potionsBrewed) {
                localStorage.setItem("potionsBrewed", JSON.stringify(0))
                potionsBrewed = 0;
            }
            potionsBrewed += 1;
            localStorage.setItem("potionsBrewed", JSON.stringify(potionsBrewed))
            const potionsInInventory = getInventory().length;
            dropdownAlertText.innerHTML = ` (${potionsBrewed}/10) You brewed: `;
            const potionImg = document.createElement('img');
            potionImg.classList.add('dropdown-alert-img');
            potionImg.setAttribute('src', `${potion.picture}`)
            potionImg.style.width = '1.5rem';
            potionImg.style.objectFit = 'fill';
            dropdownAlertText.appendChild(potionImg);

            // make the dropdown alert visible for 3 seconds, animate opacity using gsap
            gsap.to(dropdownAlert, {duration: 0.5, opacity: 1});
            setTimeout(function () {
                gsap.to(dropdownAlert, {duration: 0.5, opacity: 0});
            }
            , 1000);

            resetContentList(cauldronContents);
            
            if (potionsBrewed < 10) {
                addToInventory(potion);
            } else {
                dropdownAlertText.innerHTML = 'Inventory full';
                gsap.to(dropdownAlert, {duration: 0.5, opacity: 1});
                setTimeout(function () {
                    gsap.to(dropdownAlert, {duration: 0.5, opacity: 0});
                }
                , 1000);
            }
            return;
        }

    }
    // make the dropdown alert visible for 3 seconds, animate opacity using gsap, set text to "No potion found"
    dropdownAlertText.innerHTML = 'No potion found';
    gsap.to(dropdownAlert, {duration: 0.5, opacity: 1});
    setTimeout(function () {
        gsap.to(dropdownAlert, {duration: 0.5, opacity: 0});
    }
    , 1000);
    resetContentList(cauldronContents);
}



function updateContentList(id) {
    
    ingredientName =  potions[id].name
    ingredientImage =  potions[id].picture

    let parent = document.createElement("div");
    let pictureFrame = document.createElement("div");
    let ingredient = document.createElement("img");
    let text = document.createElement("p");

    ingredient.setAttribute("src", ingredientImage);
    ingredient.setAttribute("alt", ingredientName);
    parent.classList.add("ingredient-for-recipie");
    ingredient.classList.add("ingredient-img", "dragable");
    pictureFrame.appendChild(ingredient);

    text.innerHTML = ingredientName;

    parent.appendChild(pictureFrame);
    parent.appendChild(text);

    document.querySelector('.content-list').appendChild(parent);
}

function resetContentList(cauldronContents) {
    const contentList = document.querySelector('.content-list');
    contentList.innerHTML = '';
    cauldronContents.length = 0;
    // remove greyscaled-image class from all ingredients
    const ingredientsInventory = document.querySelectorAll('.ingredient');
    for (let i = 0; i < ingredientsInventory.length; i++) {
        ingredientsInventory[i].classList.remove('greyscaled-image');
    }
    makeIngredientsDraggable();
}

function createIngredientInventory() {
    const ingredientsInventory = document.getElementById("ingredients-list");
    ingredientsInventory.innerHTML = "";

    // loop through brewed potions and add them to the potions inventory
    for (let i = 0; i < ingredients.length; i++) {
        let parent = document.createElement("div");
        parent.classList.add("ingredient");
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