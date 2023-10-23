// Display Functions

import { getInventory } from "./inventory.js"
import { getGameRound } from "./game_storage.js"


function displayPlayerImg() {
    const characterId = localStorage.getItem('selectedCharacterId');
    const characterName = localStorage.getItem('selectedCharacterName');

    const playerName = document.querySelector('.player-name');
    const playerCharacter = document.querySelector('.player img');

    playerName.innerHTML = 'Player';

    playerCharacter.setAttribute('src', 'assets/images/player/' + characterId + '.png');
    playerCharacter.setAttribute('alt', characterName);
};

export function displayPlayer(player) {
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

export function displayVillain(villain) {
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

/**
* Adds brewed potions to the potions inventory
*/
export function displayPotions() {
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
