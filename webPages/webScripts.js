const movesEnum = {
    ROOT : 0,
    LEFT : 1,
    UP : 2,
    RIGHT : 3,
    DOWN : 4,
    LAST : 5
}

const CELL_SIZE = 92;
const CELL_GAP = 10;

let gPuzzle; // global object of puzzle

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function isMovePossible(move, map, mapSize) {
    let zeroIndex = map.indexOf(0);
    let newZeroIndex;
    let x = zeroIndex % mapSize;
    let y = Math.floor(zeroIndex / mapSize);

    switch (move) {
        case movesEnum.LEFT:
            if (x - 1 < 0)
                newZeroIndex = -1;
            else
                newZeroIndex = (x - 1) + (y * mapSize);
            break;
        case movesEnum.UP:
            if (y - 1 < 0)
                newZeroIndex = -1;
            else
                newZeroIndex = x + ((y - 1) * mapSize);
            break;
        case movesEnum.RIGHT:
            if (x + 1 == mapSize)
                newZeroIndex = -1;
            else
                newZeroIndex = (x + 1) + (y * mapSize);
            break;
        case movesEnum.DOWN:
            if (y + 1 == mapSize)
                newZeroIndex = -1;
            else
                newZeroIndex = x + ((y + 1) * mapSize);
            break;
    }

    // swap zero and tile
    if (newZeroIndex != -1) {
        let c = map[zeroIndex];
        map[zeroIndex] = map[newZeroIndex];
        map[newZeroIndex] = c;
        return (true);
    }
    return (false);
}

function makeRandMove(map, mapSize) {
    let randMove;
    let res = 0;

    do {
        randMove = getRandomInt(movesEnum.DOWN) + 1;
        res = isMovePossible(randMove, map, mapSize);
    } while (!res)
}

class Puzzle {
    constructor(mapSize, iterations) {
        let mapLength = mapSize * mapSize;
        let finishMap = new Array(mapLength);

        for (let i = 1; i < mapLength; i++) {
            finishMap[i - 1] = i;
        }
        finishMap[mapLength - 1] = 0;

        for (let i = 0; i < iterations; i++)
            makeRandMove(finishMap, mapSize);

        this.mapSize = mapSize;
        this.mapLength = mapLength;
        this.map = finishMap;
    }

    placeCell(cell, i) {
        cell.style.left = `${(i % this.mapSize) * (CELL_SIZE + CELL_GAP) + CELL_GAP}px`;
        cell.style.top = `${Math.floor(i / this.mapSize) * (CELL_SIZE + CELL_GAP) + CELL_GAP}px`;
    }

    fillCells (container) {
        const fragment = document.createDocumentFragment();
        this.board = container;
        this.holeIndex = this.map.indexOf(0);
        $('.board').empty(); // erase

        for (let i = 0; i < this.mapLength; i++) {
            let cell = document.createElement('span');

            if (i == this.holeIndex)
                cell.style = 'display:none';
                
            cell.id = i;
            cell.className = 'cell';
            cell.innerHTML = this.map[i];
            this.placeCell(cell, i);
            fragment.appendChild(cell);
        }
        this.board.appendChild(fragment);
        this.board.className = 'board';
        this.board.style.height = this.board.style.width = `${this.side * (CELL_SIZE + CELL_GAP) + CELL_GAP}px`;
    }
}

function sendJsonToServer(json, serverUrl) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", serverUrl);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Request to server : ", json);
        }
    };
    xhr.send(json);
}

function onClickShuffle(form, docPuzzle) {
    const options = form.elements;
    let puzzle, mapSize, iterations;

    mapSize = options.mapSize.value;
    iterations = options.iterations.value;

    if (isNaN(mapSize) || isNaN(iterations)) {
        var openNodes = document.getElementById('oN');
        openNodes.innerHTML = '<b style="color: #16a085;">Enter only number in form</b>';
        return;
    }

    puzzle = new Puzzle(mapSize, iterations);
    docPuzzle = puzzle.fillCells(document.getElementById('puzzle'));
    gPuzzle = puzzle;
}

let cellTimer;
function doMove(moves, iter) {
    let newZeroIdx = 0;

    if (moves.length === 1)
        return ;

    switch (moves[iter]) {
        case movesEnum.LEFT:
            newZeroIdx = parseInt(gPuzzle.holeIndex) - 1;
            break;
        case movesEnum.DOWN:
            newZeroIdx = parseInt(gPuzzle.holeIndex) + parseInt(gPuzzle.mapSize);
            break;
        case movesEnum.RIGHT:
            newZeroIdx = parseInt(gPuzzle.holeIndex) + 1;
            break;
        case movesEnum.UP:
            newZeroIdx = parseInt(gPuzzle.holeIndex) - parseInt(gPuzzle.mapSize);
            break;
    }

    let cell;
    for (let i = 0; i < gPuzzle.mapLength; i++) {
        cell = document.getElementsByClassName('cell')[i];
        if (parseInt(cell.innerHTML) === gPuzzle.map[newZeroIdx])
            break ;
    }

    // swap cells
    gPuzzle.placeCell(cell, gPuzzle.holeIndex);
    gPuzzle.map[gPuzzle.holeIndex] = gPuzzle.map[newZeroIdx];
    gPuzzle.map[newZeroIdx] = 0;
    gPuzzle.holeIndex = newZeroIdx;

    if (iter < moves.length - 1) {
        cellTimer = setTimeout(() => doMove(moves, iter + 1), 250);
    }
}

function handleMoves(moves) {
    clearTimeout(cellTimer);
    doMove(moves, 1);
}

function onClickSolve() {
    let objToSend = {};
    let strToSend;

    objToSend.messageType = 0;
    objToSend.map = JSON.stringify(gPuzzle.map);
    strToSend = JSON.stringify(objToSend);
    console.log("Request to server : ", objToSend);
    
    // sendJsonToServer(strToSend, "/message");

    $.ajax({
        type: "POST",
        url: "/message",
        contentType: 'application/json',
        data: strToSend,
        success(response) {
            let moves = JSON.parse(response.movements);

            console.log("Response from server: ", response);
            handleMoves(moves);
        },
    });
}
