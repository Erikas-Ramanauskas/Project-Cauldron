// main variables

let brewedPotions = [];
let ingredients;
let playerStats = {
    strength: 0,
    agility: 0,
    dexterity: 0,
    vitality: 0,
}

let villains
let gameturn = 0

// takes jason data and updates variables

fetch('assets/json/components_data.json')
    .then((response) => response.json())
    .then((json) => {
        components_data = json;
        villains = components_data.villains;

        // used as load function as variables are not loaded yet
        getBrewedPotions()
        // selectvillain(0)
        createPotionsInventory();

    })
    .then(() => {
        // Initialize the tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    });


// Get brewed potions from local storage and update the potions inventory
function getBrewedPotions() {
    const potions = JSON.parse(localStorage.getItem("potions"));

    if (potions) {
        // add discovered potions to brewedPotions array
        for (let potion of potions) {
            if (potion.discovered) {
                brewedPotions.push(potion);
            }
        }
    }
}


// global functions
// random integer generator
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


//  select random villain and display it's stats in html
function selectvillain(gameturn) {
    let villain = villains[getRandomInt(villains.length)];

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

// adjust villain stats based on potion used
function adjustVillainStats(strength, agility, dexterity) {
    alert("test: adjusting Villain stats");
    /*
    document.getElementById("villain-strength").innerHTML += strength;
    document.getElementById("villain-agility").innerHTML += agility;
    document.getElementById("villain-dexterity").innerHTML += dexterity;
    */
}

function adjustPlayerStats(potion) {
   alert("test: adjusting player stats");
}

function adjustPotionAmount(potion) {
    alert("test: adjusting potion amount");
}

/**
* Adds brewed potions to the potions inventory
*/
function createPotionsInventory() {
    let potionsInventory = document.getElementById("inventory-potions");

    for (let potion of brewedPotions) {
        const potionElement = document.createElement("li");
        const potionImg = document.createElement("img");

        potionImg.setAttribute("src", potion.picture);
        potionImg.setAttribute("alt", potion.name);
        potionImg.classList.add("potion-img");

        // // tooltip
        potionElement.setAttribute("data-bs-html", true);
        potionElement.setAttribute("data-bs-toggle", "tooltip");
        potionElement.setAttribute("data-bs-placement", "top");
        const tooltip = `
            ${potion.name}<br>
            <span class="text-danger">Strength</span>: ${potion.strength}<br>
            <span class="text-success">Agility</span>: ${potion.agility}<br>
            <span class="text-info">Dexterity</span>: ${potion.dexterity}
        `
        potionElement.setAttribute("data-bs-title", tooltip);

        potionElement.classList.add("potion", "list-inline-item", "grabbable");
        potionElement.setAttribute("id", "potion-" + potion.id);
        potionElement.setAttribute("data-potion-id", potion.id);
        potionElement.setAttribute("data-potion-ammount", 0);

        potionElement.appendChild(potionImg);

        potionsInventory.appendChild(potionElement);
    }
}

const draggableConfig = {
    onstart: function (event) {
        event.target.classList.add('grabbing');
        event.target.classList.remove('grabable');
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
        const potion = event.target;
        potion.classList.remove('grabbing');
        potion.classList.add('grabbable');
        resetElementPosition(event.target);
    },
};

function makePotionsDraggable() {
    interact('.potion').draggable(draggableConfig);
}

function resetElementPosition(element) {
    element.style.transform = 'translate(0px, 0px)';
    element.setAttribute('data-x', 0);
    element.setAttribute('data-y', 0);
}

makePotionsDraggable();

// setup player dropzone
interact('.player').dropzone({
    accept: '.potion',
    ondragenter: function (event) {
        const potion = event.relatedTarget;
        potion.classList.add('character-hover');
    },
    ondragleave: function (event) {
        const potion = event.relatedTarget;
        potion.classList.remove('character-hover');
    },
    ondrop: function (event) {
        const potion = event.relatedTarget;
        potion.classList.remove('character-hover');

        adjustPlayerStats(potion);
        adjustPotionAmount(potion);

        resetElementPosition(potion);
    },
});

// setup villain dropzone
interact('.villain').dropzone({
    accept: '.potion',
    ondragenter: function (event) {
        const potion = event.relatedTarget;
        potion.classList.add('character-hover');
    },
    ondragleave: function (event) {
        const potion = event.relatedTarget;
        potion.classList.remove('character-hover');
    },
    ondrop: function (event) {
        const potion = event.relatedTarget;
        potion.classList.remove('character-hover');

        adjustVillainStats(potion);
        adjustPotionAmount(potion);

        resetElementPosition(potion);
    },
});
