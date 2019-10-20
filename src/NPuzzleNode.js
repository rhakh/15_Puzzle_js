const u = require('./utils.js');

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
        this.price = u.heuristicFunc(this.map);
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
