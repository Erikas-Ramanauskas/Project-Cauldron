let cauldronContents = [];
let potions;
let ingredients;

import showRecipeBook from "./recipe_book.js";
import { createInventory, resetInventory, getInventory, addToInventory, removeFromInventory } from "./inventory.js";


const draggableConfig = {
    onstart: function (event) {
        event.target.classList.add('dragging');
    },
    onmove: function (event) {
        var target = event.target;
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    },
    onend: function (event) {
        resetElementPosition(event.target);
    },
};

document.addEventListener("DOMContentLoaded", function () {
    const ingredientElements = document.querySelectorAll('.ingredient');

    document.querySelector('.back-btn').addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    // parse json file
    fetch('assets/json/components_data.json')
        .then((response) => response.json())
        .then((json) => {

            const componentsData = json;
            potions = componentsData.potions;
            ingredients = componentsData.ingredients;

            for (let i = 0; i < ingredientElements.length; i++) {
                ingredientElements[i].style.backgroundImage = `url('${ingredients[i].picture}')`;
                // set the ingredient's name as a data attribute
                ingredientElements[i].setAttribute('data-name', ingredients[i].name);
            }
            checkLocalStorage()
    });

    document.querySelector('.cauldron').addEventListener('click', function () {
        brewPotion(potions, cauldronContents);
    });

    document.querySelector('.recipe-book').addEventListener('click', function () {
        showRecipeBook();
    });

    // for (let i = 0; i < ingredientElements.length; i++) {
    //     ingredientElements[i].addEventListener('mouseover', function () {
    //         gsap.to(ingredientElements[i], {duration: 0.2, scale: 1.1});
    //     });
    //     ingredientElements[i].addEventListener('mouseout', function () {
    //         gsap.to(ingredientElements[i], {duration: 0.2, scale: 1});
    //     });
    // }

    makeIngredientsDraggable();

    interact('.cauldron').dropzone({
        accept: '.ingredient',
        ondragenter: function (event) {
            const ingredient = event.relatedTarget;
            ingredient.classList.add('cauldron-hover');
        },
        ondragleave: function (event) {
            const ingredient = event.relatedTarget;
            ingredient.classList.remove('cauldron-hover');
        },
        ondrop: function (event) {
            const ingredient = event.relatedTarget;
            ingredient.classList.remove('cauldron-hover');

            // Add the ingredient to the cauldron
            const ingredientName = ingredient.getAttribute('data-name');
            if (cauldronContents.length < 4){
                cauldronContents.push(ingredientName);
                updateContentList(ingredientName, ingredient.style.backgroundImage);
            } else if (cauldronContents.length === 4) {
                cauldronContents.push(ingredientName);
                updateContentList(ingredientName, ingredient.style.backgroundImage);
                // append greyscaled-image class to all ingredients
                const ingredientsInventory = document.querySelectorAll('.ingredient');
                for (let i = 0; i < ingredientsInventory.length; i++) {
                    ingredientsInventory[i].classList.add('greyscaled-image');
                }
                // make ingredients not draggable
                makeIngredientsNotDraggable();

            }

            resetElementPosition(ingredient);
        },
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
            // FIXME: set all potions to undiscovered
            potions[i].discovered = true;  // temporary, to display all potions on game board
        }
        localStorage.setItem("potions", JSON.stringify(potions));
    }
}

function makeIngredientsDraggable() {
    interact('.ingredient').draggable(draggableConfig);
}

function makeIngredientsNotDraggable() {
    interact('.ingredient').unset();
}

function resetElementPosition(element) {
    element.style.transform = 'translate(0px, 0px)';
    element.setAttribute('data-x', 0);
    element.setAttribute('data-y', 0);
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
    cauldron.style.backgroundImage = "url('assets/images/general/cauldron_brew.gif')";
    audio.play();
    // wait 3 seconds
    setTimeout(function () {
        // change the cauldron gif to cauldron.gif
        audio.pause();
        cauldron.style.backgroundImage = "url('assets/images/general/cauldron.gif')";
    }, 2500);

    for(let potion of potions) {

        if(arraysEqual(potion.ingredients, cauldronContents)) {
            const potionsInInventory = getInventory().length;
            dropdownAlertText.innerHTML = ` (${potionsInInventory+1}/10) You brewed: `;
            const potionImg = document.createElement('div');
            potionImg.classList.add('dropdown-alert-img');
            potionImg.style.backgroundImage = `url('Project-Cauldron/${potion.picture}')`;
            dropdownAlertText.appendChild(potionImg);

            // make the dropdown alert visible for 3 seconds, animate opacity using gsap
            gsap.to(dropdownAlert, {duration: 0.5, opacity: 1});
            setTimeout(function () {
                gsap.to(dropdownAlert, {duration: 0.5, opacity: 0});
            }
            , 1000);

            resetContentList(cauldronContents);

            console.log(potionsInInventory);
            if (potionsInInventory < 10) {
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

function updateContentList(ingredientName, ingredientImage) {
    const contentList = document.querySelector('.content-list');
    const contentItem = document.createElement('div');
    const ingredientNameElement = document.createElement('h2');

    contentItem.classList.add('content-item');
    ingredientNameElement.classList.add('ingredient-name');
    ingredientNameElement.innerHTML = ingredientName;
    contentItem.appendChild(ingredientNameElement);

    contentItem.style.backgroundImage = ingredientImage;
    contentList.appendChild(contentItem);
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
