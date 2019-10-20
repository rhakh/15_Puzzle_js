const n = require('./NPuzzleNode.js');

function manhattanDistance(map) {
    let price = 0;
    let x1, x2, y1, y2, xres, yres;

    for (let i = 0; i < map.length; i++) {
        if (map[i]) {
            x1 = i % n.mapSize;
            y1 = Math.floor(i / n.mapSize);

            let j = n.finishMap.indexOf(map[i]);

            x2 = j % n.mapSize;
            y2 = Math.floor(j / n.mapSize);

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
    for (let row = 0; row < n.mapSize; row++) {
        for (let x1 = row * n.mapSize; x1 < row + n.mapSize; x1++) {
            for (let x2 = x1 + 1; x2 < row + n.mapSize; x2++) {
                if (map[x1] != n.finishMap[x1] && map[x2] != n.finishMap[x2] &&
                    map[x1] == n.finishMap[x2] && map[x2] == n.finishMap[x1])
                        conflicts++;
            }
        }
    }

    // conflicts in columns
    for (let col = 0; col < n.mapSize; col++) {
        for (let y1 = col; y1 < col + n.mapSize * (n.mapSize - 1); y1 += n.mapSize) {
            for (y2 = col + n.mapSize; y2 < col + n.mapSize * (n.mapSize - 1); y2 += n.mapSize) {
                if (map[y1] != n.finishMap[y1] && map[y2] != n.finishMap[y2] &&
                    map[y1] == n.finishMap[y1] && map[y2] != n.finishMap[y2])
                        conflicts++;
            }
        }
    }

    return (conflicts);
}

function misplacedTiles(map) {
    let misplaced = 0;

    for (let i = 0; i < map.length; i++) {
        if (map[i] != n.finishMap[i])
            misplaced++;
    }

    return (misplaced);
}

function heuristicFunc(map) {
    return (manhattanDistance(map) + linearConflicts(map));
}

function nodeComparison(nodeA, nodeB) {

    // optimisation by time
    if (nodeA.price == nodeB.price)
        return nodeA.length < nodeB.length;
    return nodeA.price < nodeB.price;

    // optimisation by short path
    // if (nodeA.composedPrice == nodeB.composedPrice)
    //     return (nodeA.length < nodeB.length);
    // return (nodeA.composedPrice < nodeB.composedPrice);
}

function constructPath(node, openNodes) {
    let curr = node;
    let path = [];
    let retPath = {};

    while (curr.move != n.movesEnum.ROOT) {
        path.push(curr.move);
        curr = curr.parent;
    }
    path.push(curr.move);
    path.reverse();
    retPath.moves = path;
    retPath.openNodes = openNodes;

    return (retPath);
}

function getInversions(map) {
    let inversions;

    for (let i = 0; i < map.length; i++) {
        for (let j = i + 1; j < map.length; j++) {
            if (map[i] == 0 || map[j] == 0)
                continue ;
            if (map[i] > map[j])
                inversions++;
        }
    }

    return (inversions);
}

module.exports.constructPath = constructPath;
module.exports.getInversions = getInversions;
module.exports.nodeComparison = nodeComparison;
module.exports.heuristicFunc = heuristicFunc;