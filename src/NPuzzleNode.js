let finishMap = [1, 2, 3, 4,
                 5, 6, 7, 8,
                 9, 10, 11, 12,
                 13, 14, 15, 0];

let mapSize = 4;

const movesEnum = {
    ROOT : 0,
    LEFT : 1,
    UP : 2,
    RIGHT : 3,
    DOWN : 4,
    LAST : 5
}

function manhattanDistance(map) {
    let price = 0;
    let x1, x2, y1, y2, xres, yres;

    for (let i = 0; i < map.length; i++) {
        if (map[i]) {
            x1 = i % mapSize;
            y1 = Math.floor(i / mapSize);

            let j = finishMap.indexOf(map[i]);

            x2 = j % mapSize;
            y2 = Math.floor(j / mapSize);

            xres = x1 - x2;
            if (xres < 0)
                xres *= -1;

            yres = y1 - y2;
            if (yres < 0)
                yres *= -1;

            price += xres + yres;
        }
    }

    return (price);
}

function linearConflicts(map) {
    let conflicts = 0;

    // conflicts in rows
    for (let row = 0; row < mapSize; row++) {
        for (let x1 = row * mapSize; x1 < row + mapSize; x1++) {
            for (let x2 = x1 + 1; x2 < row + mapSize; x2++) {
                if (map[x1] != finishMap[x1] && map[x2] != finishMap[x2] &&
                    map[x1] == finishMap[x2] && map[x2] == finishMap[x1])
                        conflicts++;
            }
        }
    }

    // conflicts in columns
    for (let col = 0; col < mapSize; col++) {
        for (let y1 = col; y1 < col + mapSize * (mapSize - 1); y1 += mapSize) {
            for (y2 = col + mapSize; y2 < col + mapSize * (mapSize - 1); y2 += mapSize) {
                if (map[y1] != finishMap[y1] && map[y2] != finishMap[y2] &&
                    map[y1] == finishMap[y1] && map[y2] != finishMap[y2])
                        conflicts++;
            }
        }
    }

    return (conflicts);
}

function misplacedTiles(map) {
    let misplaced = 0;

    for (let i = 0; i < map.length; i++) {
        if (map[i] != finishMap[i])
            misplaced++;
    }

    return (misplaced);
}

function heuristicFunc(map) {
    return (manhattanDistance(map) + linearConflicts(map));
}

class Node {
    constructor(map, length, move, parent) {
        
        this.map = Array.from(map);

        if (move === undefined)
            move = movesEnum.ROOT;

        if (length === undefined)
            length = -1;

        if (parent !== undefined)
            this.parent = parent;
        else
            this.parent = null;

        let zeroIndex = this.map.indexOf(0);
        let newZeroIndex;
        let x = zeroIndex % mapSize;
        let y = Math.floor(zeroIndex / mapSize);

        switch (move) {
            case movesEnum.LEFT:
                if (x - 1 < 0)
                    throw new Error("Wrong move");
                newZeroIndex = (x - 1) + (y * mapSize);
                break;
            case movesEnum.UP:
                if (y - 1 < 0)
                    throw new Error("Wrong move");
                newZeroIndex = x + ((y - 1) * mapSize);
                break;
            case movesEnum.RIGHT:
                if (x + 1 == mapSize)
                    throw new Error("Wrong move");
                newZeroIndex = (x + 1) + (y * mapSize);
                break;
            case movesEnum.DOWN:
                if (y + 1 == mapSize)
                    throw new Error("Wrong move");
                newZeroIndex = x + ((y + 1) * mapSize);
                break;
            case movesEnum.ROOT:
            default:
                newZeroIndex = zeroIndex;
                break;
        }

        // swap zero and tile
        let c = this.map[zeroIndex];
        this.map[zeroIndex] = this.map[newZeroIndex];
        this.map[newZeroIndex] = c;

        this.mapStr = JSON.stringify(this.map);

        this.move = move;
        this.length = length + 1;
        
        // calculate price with heuristic function
        this.price = heuristicFunc(this.map);
        this.composedPrice = this.price + this.length;
    }

    isEqual(node) {
        return (JSON.stringify(this.map) == JSON.stringify(node.map));
    }

    print() {
        console.log("State = {")
        for (let i = 0; i < this.map.length; i += 4) {
            console.log(this.map[i], " ",
                        this.map[i + 1], " ",
                        this.map[i + 2], " ",
                        this.map[i + 3])
        }
        console.log("}")
    }
}

function init(_mapSize) {
    mapSize = _mapSize;
    mapLength = mapSize * mapSize;

    for (let i = 0; i < mapLength; i++) {
        finishMap[i] = i + 1;
    }
    finishMap[mapLength - 1] = 0;
}

module.exports.Node = Node;
module.exports.movesEnum = movesEnum;
module.exports.mapSize = mapSize;
module.exports.finishMap = finishMap;
module.exports.init = init;
