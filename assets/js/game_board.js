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

// attack handler
function attackBtnHandler () {
    let player = getCharacter("player");
    let villain = getCharacter("villain");
    let gameResult = attack(player, villain);

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