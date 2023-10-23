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


function makePotionsDraggable() {
    interact('.potion').draggable(draggableConfig);
}

function resetElementPosition(element) {
    element.style.transform = 'translate(0px, 0px)';
    element.setAttribute('data-x', 0);
    element.setAttribute('data-y', 0);
}