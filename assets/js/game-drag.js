"use strict";

let draggables = document.getElementsByClassName("dragable");
let cauldron = document.querySelector('.cauldron img');
let player = document.querySelector(".character-card img");
let villain = document.querySelector(".villain-card img");


// item coorodinates that are used with drag start
let dragableItem = {}

// game board cooridantes for dropable places used with drag start
let dropBoxesCenters = [];

// dragable element saved for drag functions
let draggableEL;

function preventOnDragStart(draggables) {
  for (let i = 0; i < draggables.length; i++) {
    draggables[i].ondragstart = function () {
      return false;
    };
  }
}



function callAllDragables() {
  draggables = document.getElementsByClassName("dragable");
  addNewEventListeners("reset");
}

// called with either potion or ingredient type
function callAllDropables(itemType) {
    if (itemType === `potion`) {
        player = document.querySelector(".character-card img");
        villain = document.querySelector(".villain-card img");
        const data = [player, villain]
        findDropBoxesCenters(data);
    } else if (itemType === `ingredient`) {
        cauldron = document.querySelector('.cauldron img');
        findDropBoxesCenters(cauldron);
    } else {
        throw new Error(`Item type was not given`);
    }
}


function findDropBoxesCenters(data) {
    // clears old information
    dropBoxesCenters = [];
    
    if (Array.isArray(data)) {
        // loops though all boxes to return information
        for (let i = 0; i < data.length; i++) {
            const info = recodDropDimentions(data[i]);
            dropBoxesCenters.push(info);
        }
    } else {
        const info = recodDropDimentions(data);
        dropBoxesCenters.push(info);
    }
}

// recording top, left, right, bottom coordinates of the element
function recodDropDimentions(e) {
    // creating object for each of the the elements
    const info = {};
    const rect = e.getBoundingClientRect();

    // recording square dimention coordinates
    info.left = rect.left;
    info.right = rect.right;
    info.top = rect.top;
    info.bottom = rect.bottom;

    info.element = e;
    return info;
}


// Requires remove/add/reset action to work. effects draggable squares
function addNewEventListeners(action) {
  const draggables = document.getElementsByClassName(`dragable`);
  for (let i = 0; i < draggables.length; i++) {
    if (action === `remove`) {
      draggables[i].removeEventListener("pointerdown", onPointerDown);
      draggables[i].removeEventListener("pointerup", pointerup);
    } else if (action === `add`) {
      draggables[i].addEventListener("pointerdown", onPointerDown);
      draggables[i].addEventListener("pointerup", pointerup);
      preventOnDragStart(draggables);
    } else if (action === `reset`) {
      draggables[i].removeEventListener("pointerdown", onPointerDown);
      draggables[i].removeEventListener("pointerup", pointerup);

      draggables[i].addEventListener("pointerdown", onPointerDown);
      draggables[i].addEventListener("pointerup", pointerup);
      preventOnDragStart(draggables);
    } else {
      throw new Error(`Event listener action was not given`);
    }
  }
}

function getTargetElement(e) {
  let targetElement;
    if (e.target.tagName == "div") {
    targetElement = e.target;
  } else if (e.target.tagName == "IMG") {
    targetElement = e.target.parentElement;
  }  else {
    console.error("Error no dragable elemnt was found ");
  }
  return targetElement;
}

// function called with pointer down so it can record center of the dragable element
function recordItemCenter(element) {
  const info = {};
  const rect = element.getBoundingClientRect();

  // calculating half distance to the center
  info.halfX = rect.width / 2;
  info.halfY = rect.height / 2;

  // calculating center cordinates of the square at the time of pointer down
  info.cordinateX = rect.left + info.halfX;
  info.cordinateY = rect.top + info.halfY;

  // calculationg distance from square center to the pointer
  info.distanceX = info.cordinateX - dragableItem.pointerDownX;
  info.distanceY = info.cordinateY - dragableItem.pointerDownY;

  // pushing all collected data to an array
    dragableItem.elementDimentions = info;
   
}

function checkCenterBoxes(e) {
  // The fallowing code determines if center of dragable boxes are within dropboxes.
    // getting pointer cordinates during drag
  const pointerX = e.pageX;
  const pointerY = e.pageY;

    const matchedActiveSquares = findingMacthingSquares(pointerX, pointerY);
    if (matchedActiveSquares) {
        matchedActiveSquares.classList.add(`highlight`);
    }
}

/**
 * Test dragable squares center location against dropboxes area to see which ones are maching
 * @param {number} mouseX Mouse X coordinates
 * @param {number} mouseY Mouse Y coordinates
 * @returns array of elements matched, and true or false if all elements maches and the shape can be placed.
 */
function findingMacthingSquares(mouseX, mouseY) {
  let matchedActiveSquares = "";
  // looping thought dragable boxes
  const eDim = dragableItem.elementDimentions;

  const boxCenterX = mouseX + eDim.distanceX;
  const boxCenterY = mouseY + eDim.distanceY;
    

  dropBoxesCenters.forEach((e) => {
    // checkign if the dragable box center coordinates are within a dropbox square
    // added 1% reduction in avialable size due to shapes catching squares they should not
    const condition1 = boxCenterX > e.left * 1.01;
    const condition2 = boxCenterX < e.right / 1.01;
    const condition3 = boxCenterY > e.top * 1.01;
    const condition4 = boxCenterY < e.bottom / 1.01;

    const withinArea = condition1 && condition2 && condition3 && condition4;

    if (withinArea) {
      matchedActiveSquares = e.element;
    }
  });
  return matchedActiveSquares;
}

// removes highlight from all elements
function removeHighlight() {
  cauldron.classList.remove(`highlight`);
  player.classList.remove(`highlight`);
  villain.classList.remove(`highlight`);
}


// reacts when the pointers is pressed on one of the shapes
function onPointerDown(e) {
  e.preventDefault();
  
    // cleasn up dragable element if it is not empty
  dragableItem = {};

  draggableEL = getTargetElement(e)

  const rect = draggableEL.getBoundingClientRect();

  draggableEL.style.width = JSON.parse(JSON.stringify(rect.width)) + `px`;
  draggableEL.style.height = JSON.parse(JSON.stringify(rect.height)) + `px`;

  draggableEL.style.position = "absolute";
  draggableEL.style.zIndex = 200;

  // allows pointermove function to set position of shape
  dragableItem.draggableOffsetX = e.pageX - rect.left;
  dragableItem.draggableOffsetY = e.pageY - rect.top;

  draggableEL.style.left = e.pageX - dragableItem.draggableOffsetX + `px`;
  draggableEL.style.top = e.pageY - dragableItem.draggableOffsetY + `px`;

  // recording shapeWindow element to use once element is droped otside dropable places
  dragableItem.parent = draggableEL.parentElement;

  // recording were pointer was clicked
  dragableItem.pointerDownX = e.pageX;
  dragableItem.pointerDownY = e.pageY;
  dragableItem.element = draggableEL;

  recordItemCenter(draggableEL);
    
  callAllDropables(draggableEL.getAttribute("data-item"))

  document.addEventListener("pointermove", pointerMove);
}


// pointerMove purpose is to find the pointer location on the screen
function pointerMove(e) {
    e.preventDefault();
    
  // removes any higlights
  removeHighlight()

  draggableEL.style.left = e.pageX - dragableItem.draggableOffsetX + `px`;
  draggableEL.style.top = e.pageY - dragableItem.draggableOffsetY + `px`;

  checkCenterBoxes(e);
}

//Drag end works like onMouseUp and does all events right after.
// used this instead of pointer up because while using draggable property pointer events dont triger.
function pointerup(e) {
  
  removeHighlight()

  draggableEL.style.removeProperty("position");
  draggableEL.style.zIndex = "auto";
  draggableEL.style.removeProperty("left");
  draggableEL.style.removeProperty("top");

  // getting mouse cordinates during the drop
  const pointerX = e.pageX;
  const pointerY = e.pageY;

  addNewEventListeners(`reset`);

  const matchedActiveSquares = findingMacthingSquares(pointerX, pointerY);
  
    if (matchedActiveSquares) {
       
        // takes dragable item details and presents the element it self
        const dropedElement =  dragableItem.element
        
       const target = matchedActiveSquares.getAttribute("data-drop-target")
        if (target == `cauldron`) {
           const ingredientID = dropedElement.getAttribute("data-ingredient-id")
           //    call function to add ingredient to cauldron
           console.log(ingredientID);
            
            
            
            
        } else if (target == `player`) {
            const potionID = dropedElement.getAttribute("data-potion-id")
            //    call function to add potion to player
            const p = findPotionStats(potionID);
            playerStatsUpdate(p.strength, p.agility, p.dexterity, p.vitality)
            
        } else if (target == `villain`) {
            const potionID = dropedElement.getAttribute("data-potion-id")
            //    call function to add potion to villain
            const p = findPotionStats(potionID);
            villainStatsUpdate(p.strength, p.agility, p.dexterity)
            
            
        } else {
            throw new Error(`Target was not given`);
        }
    }
    
  // cleaning up data after drag ended
  dragableItem = {};
  document.removeEventListener("pointermove", pointerMove);

  draggableEL = "";

  // cleaning up data after drag ended
  dragableItem = {};
}

