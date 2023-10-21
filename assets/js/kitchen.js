let cauldronContents = [];
let potions;
let ingredients;

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
        console.log('clicked');
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
            potions[i].discovered = false;
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
    makeIngredientsNotDraggable();

    // change the cauldron gif to cauldron-brew.gif
    const cauldron = document.querySelector('.cauldron');
    cauldron.style.backgroundImage = "url('/assets/images/general/cauldron_brew.gif')";
    // wait 3 seconds
    setTimeout(function () {
        // change the cauldron gif to cauldron.gif
        cauldron.style.backgroundImage = "url('/assets/images/general/cauldron.gif')";
    }, 2500);

    for(let potion of potions) {

        if(arraysEqual(potion.ingredients, cauldronContents)) {
            dropdownAlertText.innerHTML = 'You brewed: ';
            const potionImg = document.createElement('div');
            potionImg.classList.add('dropdown-alert-img');
            potionImg.style.backgroundImage = `url('${potion.picture}')`;
            dropdownAlertText.appendChild(potionImg);

            // make the dropdown alert visible for 3 seconds, animate opacity using gsap
            gsap.to(dropdownAlert, {duration: 0.5, opacity: 1});
            setTimeout(function () {
                gsap.to(dropdownAlert, {duration: 0.5, opacity: 0});
            }
            , 1000);

            resetContentList(cauldronContents);
            addDiscoveredPotion(potion.id);
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

function addDiscoveredPotion(potionID) {
// Get the array of potions from local storage
    
    const potions = JSON.parse(localStorage.getItem('potions')) || [];
    console.log(potions);
    if (potionID >= 0 && potionID < potions.length ) {
        // If the potion is found, set its "discovered" attribute to true
        potions[potionID].discovered = true;

        // Update the potions array in local storage
        localStorage.setItem('potions', JSON.stringify(potions));
    } else {
        console.log(`Potion with ID ${potionID} was not found.`);
    }
}

function getPotions() {
    // Get the array of potions from local storage
    checkLocalStorage();
    const potions = JSON.parse(localStorage.getItem('potions')) || [];
    let discoveredPotions = [];
    for (let potion of potions) {
        if (potion.discovered) {
            discoveredPotions.push(potion);
        }
    }
    return discoveredPotions;
}

function showRecipeBook() {
    const discoveredPotions = getPotions();
    let page = 0;

    const openRecipeBook = document.querySelector('.open-recipe-book-container');
    openRecipeBook.style.display = 'block';

    const nextPageButton = document.querySelector('.next');
    const previousPageButton = document.querySelector('.previous');
    previousPageButton.disabled = true;
    previousPageButton.classList.add('greyscaled-image');
    if (discoveredPotions.length === 1) {
        nextPageButton.disabled = true;
        nextPageButton.classList.add('greyscaled-image');
    }

    showPotion(page, discoveredPotions);

    nextPageButton.addEventListener('click', function () {
        if (!nextPageButton.disabled) {
            if (page === discoveredPotions.length - 1) {
                nextPageButton.disabled = true;
                nextPageButton.classList.add('greyscaled-image');
            }
            page += 1;
            showPotion(page, discoveredPotions);
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
            showPotion(page, discoveredPotions);
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