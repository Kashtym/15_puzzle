//?
//? functions
//?

import { gameGlobalVariables, gameArea } from "../app.js";
import * as customEvents from "./events.js";

function createValueArray(n) {
    //* create array with n numbers + '' element

    const arr = [];

    for (let i = 1; i <= n; i++) {
        arr.push(i);
    }
    arr.push("");

    return arr;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function structureArray(array, rows, columns) {
    //*structure array into 2D array with: row count - 'rows', column count - 'columns'

    const resultArr = [];

    for (let i = 0; i < rows; i++) {
        resultArr.push(array.splice(0, columns));
    }

    return resultArr;
}

export function isTrueGameArray(array) {
    //*checks if a 15-puzzle array has a solution

    //If array empty return false
    if (!array) {
        return false;
    }

    //Find index in which there is an empty element
    const emptyPuzzleIndex = array.findIndex((el) => el === "");
    //Find line number in which there is an empty element
    const emptyPuzzleRow = Math.ceil((emptyPuzzleIndex + 1) / 4);

    // Find the number of inversions in the permutation (i.e. the number of such elements a[i] and a[j] that i < j but a[i] > a[j])
    let countInversionsInPermutationSummary = 0;

    for (let i = 0; i < array.length - 1; i++) {
        let countInversionsForCurrentNumber = 0;
        if (array[i]) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[j] && array[j] < array[i]) {
                    countInversionsForCurrentNumber++;
                }
            }
        }
        countInversionsInPermutationSummary += countInversionsForCurrentNumber;
    }

    //solution exists if and only if countInversionsInPermutationSummary + emptyPuzzleRow is even.
    return (countInversionsInPermutationSummary + emptyPuzzleRow) % 2 ? false : true;
}

export function createTrueArray() {
    return structureArray(createValueArray(15), 4, 4);
}

export function createGameArray() {
    const array = createValueArray(15);

    do {
        shuffleArray(array);
    } while (!isTrueGameArray(array));

    return structureArray(array, 4, 4);
}

export function createGameArea(gameAreaElem) {
    //*create game area with value puzzle

    //* clear game area
    gameAreaElem.innerHTML = "";

    //* create
    let valueArray = createGameArray();

    if (valueArray.length > 0) {
        for (let i = 0; i < valueArray.length; i++) {
            for (let j = 0; j < valueArray[i].length; j++) {
                let cellElem = createCell(i, j);
                cellElem.append(createPuzzle(valueArray[i][j]));
                gameAreaElem.append(cellElem);
            }
        }
    }
    gameGlobalVariables.setMovablePuzzleArray = findMovablePuzzleArray();
    addMovablePuzzlesEvents(gameGlobalVariables.movablePuzzleArray);
}

export function isWin(trueArr) {
    //*checks if a 15-puzzle in game area is resolved

    for (let i = trueArr.length - 1; i >= 0; i--) {
        for (let j = trueArr[i].length - 1; j >= 0; j--) {
            let cell = gameArea.querySelector(`[data-row="${i}"][data-column="${j}"]`);
            let puzzleValue;
            if (cell.firstElementChild) {
                puzzleValue = cell.firstElementChild.textContent;
            } else {
                puzzleValue = "";
            }
            if (trueArr[i][j] != puzzleValue) {
                return false;
            }
        }
    }
    return true;
}

function createCell(row, column) {
    let elem = document.createElement("div");
    elem.classList.add("game-area__cell");
    elem.dataset.row = row;
    elem.dataset.column = column;
    elem.addEventListener("dragenter", customEvents.handlerDragenter);
    elem.addEventListener("dragleave", customEvents.handlerDragleave);
    elem.addEventListener("drop", customEvents.handlerDrop);
    return elem;
}

function createPuzzle(value) {
    if (value) {
        let elem = document.createElement("div");
        elem.classList.add("puzzle");
        elem.id = value;
        let elemChild = document.createElement("div");
        elemChild.classList.add("puzzle__border");
        elemChild.innerHTML = value;
        elem.append(elemChild);
        return elem;
    }
    return "";
}

export function addMovablePuzzlesEvents(movableItemArray) {
    //*add the ability to move to movable puzzles

    movableItemArray.forEach((itemId) => {
        let puzzle = document.getElementById(itemId);
        if (puzzle) {
            puzzle.draggable = true;
            puzzle.addEventListener("dragstart", customEvents.handlerDragstart);
            // puzzle.addEventListener("touchmove", customEvents.handlerDragMoveMobile);
            puzzle.addEventListener("dragend", customEvents.handlerDragend);
            puzzle.classList.add("puzzle--move");
        }
    });
}

export function removeMovablePuzzlesEvents(movableItemArray) {
    //*remove the ability to move to unmovable puzzles

    movableItemArray.forEach((itemId) => {
        let puzzle = document.getElementById(itemId);
        if (puzzle) {
            puzzle.draggable = false;
            puzzle.removeEventListener("dragstart", customEvents.handlerDragstart);
            puzzle.removeEventListener("dragend", customEvents.handlerDragend);
            puzzle.classList.remove("puzzle--move");
        }
    });
}

export function findMovablePuzzleArray() {
    //*find and return array with movable puzzles

    const array = [];
    const puzzleArray = [...gameArea.querySelectorAll(".game-area__cell")];
    const hollowPuzzle = puzzleArray.find((el) => el.childElementCount === 0);
    const [hollowPuzzleRow, hollowPuzzleColumn] = [hollowPuzzle.dataset.row, hollowPuzzle.dataset.column];

    const topPuzzle = puzzleArray.find((el) => el.dataset.row === (+hollowPuzzleRow - 1).toString() && el.dataset.column === hollowPuzzleColumn);
    if (topPuzzle) {
        array.push(+topPuzzle.firstElementChild.id);
    }

    const rightPuzzle = puzzleArray.find((el) => el.dataset.row === hollowPuzzleRow && el.dataset.column === (+hollowPuzzleColumn + 1).toString());
    if (rightPuzzle) {
        array.push(+rightPuzzle.firstElementChild.id);
    }

    const bottomPuzzle = puzzleArray.find((el) => el.dataset.row === (+hollowPuzzleRow + 1).toString() && el.dataset.column === hollowPuzzleColumn);
    if (bottomPuzzle) {
        array.push(+bottomPuzzle.firstElementChild.id);
    }

    const leftPuzzle = puzzleArray.find((el) => el.dataset.row === hollowPuzzleRow && el.dataset.column === (+hollowPuzzleColumn - 1).toString());
    if (leftPuzzle) {
        array.push(+leftPuzzle.firstElementChild.id);
    }

    return array;
}
