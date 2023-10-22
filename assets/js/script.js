// main variables
import { getInventory, removeFromInventory, addToInventory } from "./inventory.js"

let villains
let gameturn = 0

setPlayerCharacter();
createPotionsInventory();

// Initialize the tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

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

    let potions = getInventory();   // get potions from local storage
    let potionsInventory = document.getElementById("inventory-potions");
    potionsInventory.innerHTML = "";
    for (let potion of potions) {
        const potionElement = document.createElement("li");
        const potionImg = document.createElement("img");
        const badge = document.createElement("span");

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

        potionElement.classList.add("potion", "position-relative", "list-inline-item", "grabbable");
        potionElement.setAttribute("id", "potion-" + potion.id);
        potionElement.setAttribute("data-potion-id", potion.id);
        potionElement.setAttribute("data-potion-ammount", 0);

        // badge with potion amount
        badge.classList.add("position-absolute", "top-0", "start-100", "translate-middle", "badge", "bg-secondary", "rounded-pill");
        badge.innerHTML = potion.amount;

        potionElement.appendChild(potionImg);
        potionElement.appendChild(badge);

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

        // get data porion-id from potion
        const potionId = potion.getAttribute("data-potion-id");

        adjustPlayerStats(potion);
        removeFromInventory(potionId);
        createPotionsInventory();

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

        // get data porion-id from potion
        const potionId = potion.getAttribute("data-potion-id");

        adjustVillainStats(potion);
        removeFromInventory(potionId);
        createPotionsInventory();

        resetElementPosition(potion);
    },
});

// Keyboard event for menu open
document.addEventListener('keydown', function (event) {
    if (event.key === 'p' || event.key === 'P') {
        const menu = document.getElementById('menu');
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
    }
});

// Set player character image and name
function setPlayerCharacter() {
    const characterId = localStorage.getItem('selectedCharacterId');
    const characterName = localStorage.getItem('selectedCharacterName');

    const playerName = document.querySelector('.player-name');
    const playerCharacter = document.querySelector('.player img');

    playerName.innerHTML = characterName;

    playerCharacter.setAttribute('src', 'assets/images/player/' + characterId + '.png');
    playerCharacter.setAttribute('alt', characterName);
};
