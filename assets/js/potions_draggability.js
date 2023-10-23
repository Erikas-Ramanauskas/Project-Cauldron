// potions draggability

import { displayPotions } from "./game_board_display.js"
import { adjustStats } from "./game_board.js"

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

makePotionsDraggable();

// setup player dropzone
interact('.player').dropzone({
    accept: '.potion',
    ondragenter: function (event) {
        const playerImage = event.target.querySelector('img'); // Select the img inside the player element
        if (playerImage) {
            playerImage.classList.add('character-hover');
        }
    },
    ondragleave: function (event) {
        const playerImage = event.target.querySelector('img'); // Select the img inside the player element
        if (playerImage) {
            playerImage.classList.remove('character-hover');
        }
    },
    ondrop: function (event) {
        const playerImage = event.target.querySelector('img'); // Select the img inside the player element
        if (playerImage) {
            playerImage.classList.remove('character-hover');
        }

        // get data potion-id from potion
        const potion = event.relatedTarget;
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
        const villainImage = event.target.querySelector('img'); // Select the img inside the villain element
        if (villainImage) {
            villainImage.classList.add('character-hover');
        }
    },
    ondragleave: function (event) {
        const villainImage = event.target.querySelector('img'); // Select the img inside the villain element
        if (villainImage) {
            villainImage.classList.remove('character-hover');
        }
    },
    ondrop: function (event) {
        const villainImage = event.target.querySelector('img'); // Select the img inside the villain element
        if (villainImage) {
            villainImage.classList.remove('character-hover');
        }

        // get data potion-id from potion
        const potion = event.relatedTarget;
        const potionId = potion.getAttribute("data-potion-id");

        adjustStats(potionId, "villain");
        displayPotions();

        resetElementPosition(potion);
    },
});


function makePotionsDraggable() {
    interact('.potion').draggable(draggableConfig);
}

function resetElementPosition(element) {
    element.style.transform = 'translate(0px, 0px)';
    element.setAttribute('data-x', 0);
    element.setAttribute('data-y', 0);
}