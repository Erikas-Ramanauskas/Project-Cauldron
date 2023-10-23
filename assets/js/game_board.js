import { getInventory, removeFromInventory, resetInventory } from "./inventory.js"
import { getCharacter, setCurrentCharacter, getGameRound, setGameRound } from "./game_storage.js"
import { displayRound, displayPlayer, displayVillain, displayPotions } from "./game_board_display.js"
import generateCharacters from './generate_characters.js';
import applyPotion from './apply_potion.js';
import attack from './attack.js';

let difficulty = 0.1;
let audio = true;

runGame(difficulty);

document.getElementById('attack-btn').addEventListener('click', attackBtnHandler);
document.getElementById('sounds').addEventListener('click', function () {
    if (audio) {
        audio = false;
        document.getElementById('sounds').innerHTML = 'Sounds: OFF';
    } else {
        audio = true;
        document.getElementById('sounds').innerHTML = 'Sounds: ON';
    }
});

function runGame(difficulty) {
    let turn = getGameRound();
    if (!turn || turn <= 0) {
        // if no turn or turn is 0, start new game
        setGameRound(1);
        runRound(difficulty)
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
function runRound(difficulty) {
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

// attack handler
function attackBtnHandler () {
    let player = getCharacter("player");
    let villain = getCharacter("villain");
    let gameResult = attack(player, villain);
    const sound = new Audio('assets/sounds/witchs_laugh.wav');
    const sound2 = new Audio('assets/sounds/demon_grunt.wav');

    let random = Math.floor(Math.random() * 2) + 1;
    if (audio) {
        if (random === 1) {
            sound.play();
        } else {
            sound2.play();
        }
    }

    console.log(gameResult.player);
    console.log(gameResult.enemy);

    if (gameResult === true) {
        // player won
        console.log('player won');
        alert('You won!');
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
        alert('You lost!');
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

// adjust stats on potion drop
export function adjustStats(potionId, characterName) {
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