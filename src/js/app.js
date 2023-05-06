import * as customFunctions from "./modules/functions.js";

export const gameArea = document.querySelector(".game-area");
export const modal = document.querySelector(".modal");
const startButton = document.querySelector("#start");

export const trueArray = customFunctions.createTrueArray();

export const gameGlobalVariables = {
    draggedItem: null,
    movablePuzzleArray: [],
    set setDraggedItem(value) {
        this.draggedItem = value;
    },
    set setMovablePuzzleArray(array) {
        this.movablePuzzleArray = array;
    },
};

// startButton.addEventListener("click", () => customFunctions.createGameArea(trueArray, gameArea));
startButton.addEventListener("click", () => customFunctions.createGameArea(gameArea));

customFunctions.createGameArea(gameArea);
