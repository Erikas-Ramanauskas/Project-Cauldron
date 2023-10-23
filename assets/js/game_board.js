import { getInventory, removeFromInventory, resetInventory } from "./inventory.js"
import {
    getCharacter, setCurrentCharacter, getGameRound, setGameRound, setPotionApplied, isPotionApplied, resetPotionApplied, isCharacterSelected
} from "./game_storage.js"
import { displayRound, displayPlayer, displayVillain, displayPotions, displayToastMsg } from "./game_board_display.js"
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
function attackBtnHandler() {

    if (!isCharacterSelected()) {
        displayToastMsg('Select a character before playing!');
        return;
    }

    // check if the potion is applied
    if (!isPotionApplied()) {
        displayToastMsg('Apply a potion before attacking!');
        return;
    }

    // reset potion applied
    resetPotionApplied();


    let player = getCharacter("player");
    let villain = getCharacter("villain");
    let gameResult = attack(player, villain);

    if (gameResult === true) {
        // player won
        displayToastMsg('You won!');
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
                localStorage.setItem("potionsBrewed", JSON.stringify(0));
            })
    } else if (gameResult === false) {
        // player lost
        displayToastMsg('You lost!');
        // reset round and inventory
        setGameRound(0);

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
                displayRound();
                localStorage.setItem("potionsBrewed", JSON.stringify(0))
            })
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
    let previous_character = getCharacter(characterName);
    let new_character = applyPotion(previous_character, potion);
    setCurrentCharacter(new_character, characterName);

    if (characterName === "player") {
        displayPlayer(new_character);
    } else {
        displayVillain(new_character);
    }

    // remove potion from inventory
    removeFromInventory(potionId);

    // set potion applied
    setPotionApplied();
}
