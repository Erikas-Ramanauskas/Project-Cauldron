// main variables
import { getInventory, removeFromInventory, addToInventory, resetInventory } from "./inventory.js"
import generateCharacters from './generate_characters.js';
import applyPotion from './apply_potion.js';
import attack from './attack.js';

runGame();

// save game round in local storage
function setGameRound(turn) {
    localStorage.setItem("turn", turn);
}

// get game round from local storage
function getGameRound() {
    let turn = localStorage.getItem("turn");
    return turn;
}

// save character in local storage
function setCurrentCharacter(character, characterName) {
    localStorage.setItem(characterName, JSON.stringify(character));
}

// get character from local storage
function getCharacter(characterName) {
    let character = localStorage.getItem(characterName);
    if (!character) {
        character = {};
    } else {
        character = JSON.parse(character);
    }
    return character;
}

// generate characters
function runRound(difficulty = 0.1) {
    return generateCharacters(difficulty, "assets/images/hero.png")
        .then(characters => {
            let villain = characters.enemy;
            let player = characters.player;

            // save characters in local storage
            setCurrentCharacter(villain, "villain");
            setCurrentCharacter(player, "player");
        })
        .catch(err => {
            console.error("Error generating characters:", err);
        });
}

function runGame() {
    let turn = getGameRound();
    if (!turn || turn <= 0) {
        setGameRound(1);
        runRound()
            .then(() => {
                // get characters from local storage
                let villain = getCharacter("villain");
                let player = getCharacter("player");
                // display characters
                displayVillain(villain);
                displayPlayer(player);
                displayPotions();
            })
    } else {

        // get characters from local storage
        let villain = getCharacter("villain");
        let player = getCharacter("player");

        // display characters
        displayVillain(villain);
        displayPlayer(player);
        displayPotions();
    }
}

// attack handler
function attackBtnHandler () {
    let player = getCharacter("player");
    let villain = getCharacter("villain");
    let gameResult = attack(player, villain);

    if (gameResult === true) {
        // player won
        console.log('player won');
        let turn = getGameRound();
        turn++;
        setGameRound(turn);
        runRound()
            .then(() => {
                // get characters from local storage
                let villain = getCharacter("villain");
                let player = getCharacter("player");
                // display characters
                displayVillain(villain);
                displayPlayer(player);
                resetInventory();
                displayPotions();
            })
    } else if (gameResult === false) {
        // player lost
        console.log('player lost');
        // reset round and inventory
        setGameRound(0);
        resetInventory();
        displayPotions();
        // TODO: ask if player wants to play again using a modal
    } else {
        // game continues
        console.log('game continues');
        setCurrentCharacter(gameResult.player, "player");
        setCurrentCharacter(gameResult.enemy, "villain");
        displayPlayer(gameResult.player);
        displayVillain(gameResult.enemy);
    }
}

function displayPlayerImg() {
    const characterId = localStorage.getItem('selectedCharacterId');
    const characterName = localStorage.getItem('selectedCharacterName');

    const playerName = document.querySelector('.player-name');
    const playerCharacter = document.querySelector('.player img');

    playerName.innerHTML = 'Player';

    playerCharacter.setAttribute('src', 'assets/images/player/' + characterId + '.png');
    playerCharacter.setAttribute('alt', characterName);
};

function displayPlayer(player) {
    displayPlayerImg();

    const playerHealth = document.querySelector('#player-hp');
    const playerStrength = document.querySelector('#player-strength');
    const playerAgility = document.querySelector('#player-agility');
    const playerDexterity = document.querySelector('#player-dexterity');

    playerHealth.setAttribute('aria-valuenow', player.health);
    playerHealth.style.width = player.health + '%';

    playerStrength.setAttribute('aria-valuenow', player.strength);
    playerStrength.style.width = player.strength + '%';

    playerAgility.setAttribute('aria-valuenow', player.agility);
    playerAgility.style.width = player.agility + '%';

    playerDexterity.setAttribute('aria-valuenow', player.dexterity);
    playerDexterity.style.width = player.dexterity + '%';
}

function displayVillain(villain) {
    const villainName = document.querySelector('#villainName');
    const villainImage = document.querySelector('#villainImage');
    const villainHealth = document.querySelector('#villain-hp');
    const villainStrength = document.querySelector('#villain-strength');
    const villainAgility = document.querySelector('#villain-agility');
    const villainDexterity = document.querySelector('#villain-dexterity');

    villainName.innerHTML = villain.name;
    villainImage.setAttribute('src', villain.picture);

    villainHealth.setAttribute('aria-valuenow', villain.health);
    villainHealth.style.width = villain.health + '%';

    villainStrength.setAttribute('aria-valuenow', villain.strength);
    villainStrength.style.width = villain.strength + '%';

    villainAgility.setAttribute('aria-valuenow', villain.agility);
    villainAgility.style.width = villain.agility + '%';

    villainDexterity.setAttribute('aria-valuenow', villain.dexterity);
    villainDexterity.style.width = villain.dexterity + '%';

}

// adjust stats based on potion used
function adjustStats(potionId, characterName) {
    console.log(characterName);
    let inventory = getInventory();
    let potion = inventory.find(item => item.id === potionId);
    let character = getCharacter(characterName);
    character = applyPotion(character, potion);
    setCurrentCharacter(character, characterName);

    if (characterName === "player") {
        displayPlayer(character);
    } else {
        displayVillain(character);
    }

    // remove potion from inventory
    removeFromInventory(potionId);
}
/**
* Adds brewed potions to the potions inventory
*/
function displayPotions() {
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

        initializeTooltips();
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

        // hide tooltip on drag
        let tooltipInstance = bootstrap.Tooltip.getInstance(event.target);
        if (tooltipInstance) {
          tooltipInstance.hide();
        }

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

        adjustStats(potionId, "player");
        displayPotions();

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

        adjustStats(potionId, "villain");
        displayPotions();

        resetElementPosition(potion);
    },
});


document.getElementById('attack-btn').addEventListener('click', attackBtnHandler);

// Keyboard event for menu open
document.addEventListener('keydown', function (event) {
    if (event.key === 'p' || event.key === 'P') {
        const menu = document.getElementById('menu');
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
    }
});

function initializeTooltips() {
    // Initialize the tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}