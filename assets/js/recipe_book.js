/*
ADD TO HTML:

<link rel="stylesheet" href="assets/css/kitchen.css">

<div class="open-recipe-book-container">
    <div class="close-btn"></div>
    <div class="open-recipe-book">
        <div class="left-page">
            <div class="left-page-header">
                <div class="left-page-header-title"><p>Naiads Aquatic Aura Brew</p></div>
                <div class="left-page-header-img"></div>
            </div>
            <div class="left-page-content">
                <div class="left-page-stat"><span class="circle"></span><p class="stat-text"></p></div>
                <div class="left-page-stat"><span class="circle"></span><p class="stat-text"></p></div>
                <div class="left-page-stat"><span class="circle"></span><p class="stat-text"></p></div>
            </div>
        </div>
        <div class="right-page">
            <div class="right-page-header">
                <div class="right-page-header-title">Recipe:</div>
            </div>
            <div class="right-page-content">
                <div class="right-page-ingredient"><span class="recipe-ingredient-img"></span><p class="recipe-ingredient-text"></p></div>
                <div class="right-page-ingredient"><span class="recipe-ingredient-img"></span><p class="recipe-ingredient-text"></p></div>
                <div class="right-page-ingredient"><span class="recipe-ingredient-img"></span><p class="recipe-ingredient-text"></p></div>
                <div class="right-page-ingredient"><span class="recipe-ingredient-img"></span><p class="recipe-ingredient-text"></p></div>
                <div class="right-page-ingredient"><span class="recipe-ingredient-img"></span><p class="recipe-ingredient-text"></p></div>
            </div>
        </div>
    </div>
    <div class="page-btns-container">
        <div class="previous"><--</div>
        <div class="next"><--</div>
    </div>    
</div>

USAGE:

import showRecipeBook from "./recipe_book.js";

showRecipeBook();
*/

import fetchData from "./fetch_data.js";

let componentsData;
let ingredients;
let potions;
export default function showRecipeBook() {
    return fetchData().then(data => {
        componentsData = data;
        potions = componentsData.potions;
        ingredients = componentsData.ingredients;
        return recipeBook();
    });
}

function checkLocalStorage() {
    if (localStorage.getItem("potions") !== null) {
        let discoveredPotions = JSON.parse(localStorage.getItem("potions"));
        let potions = discoveredPotions;
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

// function getPotions() {
//     // Get the array of potions from local storage
//     checkLocalStorage();
//     const potions = JSON.parse(localStorage.getItem('potions')) || [];
//     let discoveredPotions = [];
//     for (let potion of potions) {
//         if (potion.discovered) {
//             discoveredPotions.push(potion);
//         }
//     }
//     return discoveredPotions;
// }

function recipeBook() {
    // const discoveredPotions = getPotions();
    let page = 0;

    const openRecipeBook = document.querySelector('.open-recipe-book-container');
    openRecipeBook.style.display = 'block';

    const nextPageButton = document.querySelector('.next');
    const previousPageButton = document.querySelector('.previous');
    previousPageButton.disabled = true;
    previousPageButton.classList.add('greyscaled-image');
    if (potions.length === 1) {
        nextPageButton.disabled = true;
        nextPageButton.classList.add('greyscaled-image');
    }

    showPotion(page, potions);

    nextPageButton.addEventListener('click', function () {
        if (!nextPageButton.disabled) {
            if (page === potions.length - 1) {
                nextPageButton.disabled = true;
                nextPageButton.classList.add('greyscaled-image');
            }
            page += 1;
            showPotion(page, potions);
            previousPageButton.disabled = false;
            previousPageButton.classList.remove('greyscaled-image');
        }
    });

    previousPageButton.addEventListener('click', function () {
        if (!previousPageButton.disabled) {
            if (page === 0) {
                previousPageButton.disabled = true;
                previousPageButton.classList.add('greyscaled-image');
            }
            page -= 1;
            showPotion(page, potions);
            nextPageButton.disabled = false;
            nextPageButton.classList.remove('greyscaled-image');
        }
    });

    const closeRecipeBookButton = document.querySelector('.close-btn');
    closeRecipeBookButton.addEventListener('click', function () {
        page = 0;

        nextPageButton.disabled = false;
        nextPageButton.classList.remove('greyscaled-image');
        previousPageButton.disabled = false;
        previousPageButton.classList.remove('greyscaled-image');
        openRecipeBook.style.display = 'none';
    });

}

function showPotion(index, discoveredPotions) {

    const potionTitleElement = document.querySelector('.left-page-header-title');
    const potionImageElement = document.querySelector('.left-page-header-img');
    const potionStatsElements = document.querySelectorAll('.stat-text');
    const statCircles = document.querySelectorAll('.circle');
    const recipeIngredientImageElements = document.querySelectorAll('.recipe-ingredient-img');
    const recipeIngredientNameElements = document.querySelectorAll('.recipe-ingredient-text');

    if (discoveredPotions.length > 0) {
        const potion = discoveredPotions[index];
        console.log(potion);
        potionTitleElement.innerHTML = potion.name;
        potionImageElement.style.backgroundImage = `url('${potion.picture}')`;
        potionStatsElements[0].innerHTML = potion.strength + ' Strength';
        statCircles[0].style.backgroundColor = 'red';
        potionStatsElements[1].innerHTML = potion.agility + ' Agility';
        statCircles[1].style.backgroundColor = 'green';
        potionStatsElements[2].innerHTML = potion.dexterity + ' Dexterity';
        statCircles[2].style.backgroundColor = 'blue';
        for (let i = 0; i < 5; i++) {
            recipeIngredientImageElements[i].style.backgroundImage = '';
            recipeIngredientNameElements[i].innerHTML = '';
        }
        for (let i = 0; i < potion.ingredients.length; i++) {
            // Loop over potion ingredients and find the corresponding ingredient in the ingredients array
            // Then set the ingredient's picture and name in the recipe book

            // Find the ingredient in the ingredients array
            const ingredient = ingredients.find(function (ingredient) {
                return ingredient.name === potion.ingredients[i];
            });
            // Set the ingredient's picture and name in the recipe book
            recipeIngredientImageElements[i].style.backgroundImage = `url('${ingredient.picture}')`;
            recipeIngredientNameElements[i].innerHTML = ingredient.name;
        }
    }
}