document.addEventListener("DOMContentLoaded", function () {
    const ingredientElements = document.querySelectorAll('.ingredient');
    // parse json file
    fetch("/assets/json/components_data.json")
        .then((response) => response.json())
        .then((json) => {
            const componentsData = json;
            const potions = componentsData.potions;
            const ingredients = componentsData.ingredients;

            for (let i = 0; i < ingredientElements.length; i++) {
                ingredientElements[i].style.backgroundImage = `url('${ingredients[i].picture}')`;
            }
        })

});