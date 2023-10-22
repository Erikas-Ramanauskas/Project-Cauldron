document.addEventListener("DOMContentLoaded", function () {
    const selectBtn = document.getElementById('select-player-btn')
    selectBtn.addEventListener('click', function (event) {
        event.preventDefault();

        // Get the active character
        const activeCharacter = document.querySelector('#playerSelect .carousel-item.active');
        const characterId = activeCharacter.getAttribute('data-character-id');
        const characterName = activeCharacter.getAttribute('data-character-name');

        // Save character data to local storage
        localStorage.setItem('selectedCharacterId', characterId);
        localStorage.setItem('selectedCharacterName', characterName);

        // Redirect to game page
        window.location.href = 'game.html';
    });
});