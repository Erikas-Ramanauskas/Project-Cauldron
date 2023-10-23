import {  setSelectedCharacter } from "./game_storage.js"
import {  displaySelectCharacterModal } from "./game_board_display.js"

document.addEventListener("DOMContentLoaded", function () {
    const selectBtn = document.getElementById('select-player-btn')
    selectBtn.addEventListener('click', function (event) {
        event.preventDefault();

        // Get the active character
        const activeCharacter = document.querySelector('#playerSelect .carousel-item.active');
        const characterId = activeCharacter.getAttribute('data-character-id');
        const characterName = activeCharacter.getAttribute('data-character-name');

        // Save character data to local storage
        setSelectedCharacter(characterId, characterName);

        // Redirect to game page
        window.location.href = 'game.html';
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const selectBtn = document.querySelector('.player');
    selectBtn.addEventListener('click', function (event) {
        event.preventDefault();
        displaySelectCharacterModal();
    });
});