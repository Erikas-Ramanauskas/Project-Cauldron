// main variables
import { getInventory, removeFromInventory, resetInventory } from "./inventory.js"
import { getCharacter, setCurrentCharacter, getGameRound, setGameRound } from "./game_storage.js"
import { displayRound, displayPlayer, displayVillain, displayPotions } from "./game_board_display.js"
import generateCharacters from './generate_characters.js';
import applyPotion from './apply_potion.js';
import attack from './attack.js';

runGame();

document.getElementById('attack-btn').addEventListener('click', attackBtnHandler);

function runGame() {
    let turn = getGameRound();
    if (!turn || turn <= 0) {
        // if no turn or turn is 0, start new game
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
                displayRound();
            })
    } else {
        // get characters from local storage
        let villain = getCharacter("villain");
        let player = getCharacter("player");

        // display characters, potions and round
        displayVillain(villain);
        displayPlayer(player);
        displayPotions();
        displayRound();
    }
}

// generate characters for new round
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

        let difficulty = turn * 0.1;
        // run new round with increased difficulty
        runRound(difficulty)
            .then(() => {
                // get characters from local storage
                let villain = getCharacter("villain");
                let player = getCharacter("player");
                // display characters
                displayVillain(villain);
                displayPlayer(player);
                resetInventory();
                displayPotions();
                displayRound();
            })
    } else if (gameResult === false) {
        // player lost
        console.log('player lost');
        // reset round and inventory
        setGameRound(0);
        resetInventory();
        displayPotions();
        displayRound();
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


// potions draggability
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

// ./potions draggability


// Keyboard event for menu open
document.addEventListener('keydown', function (event) {
    if (event.key === 'p' || event.key === 'P') {
        const menu = document.getElementById('menu');
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
    }
});
