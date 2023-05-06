//*
//* drag and drop desctop
//*

import { trueArray, modal, gameGlobalVariables, gameArea } from "../app.js";
import * as customFunctions from "./functions.js";

export function handlerDragstart(event) {
    gameGlobalVariables.setDraggedItem = this;
    this.classList.add("puzzle--active");
    event.dataTransfer.effectAllowed = "move";
    console.dir(this);
}

export function handlerDragend(event) {
    gameGlobalVariables.setDraggedItem = null;
    this.classList.remove("puzzle--active");
}

export function handlerDragenter(event) {
    if (!gameGlobalVariables.draggedItem) {
        return;
    }
    if (this.childElementCount === 0 || event.target.textContent == gameGlobalVariables.draggedItem.textContent) {
        this.classList.add("game-area__cell--active");
        this.addEventListener("dragover", handlerDragover);
    }
}

export function handlerDragleave(event) {
    this.classList.remove("game-area__cell--active");
    this.removeEventListener("dragover", handlerDragover);
}

function handlerDragover(event) {
    event.preventDefault();
}

export function handlerDrop(event) {
    if (this.childElementCount === 0) {
        this.append(gameGlobalVariables.draggedItem);
        gameGlobalVariables.setDraggedItem = null;
        if (customFunctions.isWin(trueArray)) {
            modal.classList.add("modal--active");
            customFunctions.removeMovablePuzzlesEvents(gameGlobalVariables.movablePuzzleArray);
        } else {
            customFunctions.removeMovablePuzzlesEvents(gameGlobalVariables.movablePuzzleArray);
            gameGlobalVariables.setMovablePuzzleArray = customFunctions.findMovablePuzzleArray();
            customFunctions.addMovablePuzzlesEvents(gameGlobalVariables.movablePuzzleArray);
        }
    }
    this.classList.remove("game-area__cell--active");
    this.removeEventListener("dragover", handlerDragover);
}

// export function handlerDragMoveMobile(event) {
//     //event.preventDefault();

//     let touch = event.targetTouches[0];
//     let moveElement = event.target;

//     gameArea.append(moveElement);

//     moveElement.style.left = `${touch.pageX}px`;
//     moveElement.style.top = `${touch.pageY}px`;

//     // console.dir(moveElement);
// }
