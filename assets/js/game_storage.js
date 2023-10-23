// SET/GET game data(round, characters) in local storage


// save game round in local storage
export function setGameRound(turn) {
    localStorage.setItem("turn", turn);
}

// get game round from local storage
export function getGameRound() {
    let turn = localStorage.getItem("turn");
    return turn;
}

// save character in local storage
export function setCurrentCharacter(character, characterName) {
    localStorage.setItem(characterName, JSON.stringify(character));
}

// get character from local storage
export function getCharacter(characterName) {
    let character = localStorage.getItem(characterName);
    if (!character) {
        character = {};
    } else {
        character = JSON.parse(character);
    }
    return character;
}


// check if potion is applied
export function isPotionApplied() {
    let potionApplied = localStorage.getItem("potionApplied");
    if (potionApplied === "true") {
        return true;
    } else {
        return false;
    }
}

// set potion applied
export function setPotionApplied() {
    localStorage.setItem("potionApplied", "true");
}

// reset potion applied
export function resetPotionApplied() {
    localStorage.setItem("potionApplied", "false");
}