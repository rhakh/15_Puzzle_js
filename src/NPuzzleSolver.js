"use strict"

const n = require('./NPuzzleNode.js');
const u = require('./utils.js');
const FastPriorityQueue = require('fastpriorityqueue');

function aStar(map) {
    let openSet = new FastPriorityQueue(u.nodeComparison);
    let closedSet = new Set();
    let openNodes = 0;
    let root = new n.Node(map, 0);
    let curr;

    openSet.add(root);
    openNodes++;
    while (!openSet.isEmpty()) {
        curr = openSet.poll();

        if (closedSet.has(curr.mapStr)) {
            // curr node already exist in closed set
            // poll another one
            curr = undefined;
            continue;
        }
        // curr doesn't exist in closedSet, so add it
        closedSet.add(curr.mapStr);

        // Finish
        if (curr.price == 0) {
            // construct path
            let path = u.constructPath(curr, openNodes);
            return (path);
        }

        // Add all posible moves to openSet
        for (let move = n.movesEnum.LEFT; move < n.movesEnum.LAST; move++) {
            try {
                let node = new n.Node(curr.map, curr.length, move, curr);
                openSet.add(node);
                openNodes++;
            }
            catch (err) {
                // nothing to do
                continue ;
            }
        }
    }

    // can't find solution
    return null;
}

function isSolvable(map) {
    let inversions = u.getInversions(map);
    let zeroIndex = map.indexOf(0) % n.mapSize + 1;
    let isEven = (a) => { return ((a & 0x1) == 0); }

    for (let i = 0; i < map.length; i++) {
        if (map.indexOf(i) == -1) {
            console.log("Invalid map");
            return (false);
        }
    }

    zeroIndex = Math.floor(zeroIndex / n.mapSize) + 1;

    return (isEven(inversions + zeroIndex));
}

function solve(map) {
    n.init(Math.floor(Math.sqrt(map.length)));

    if (!isSolvable(map)) {
        console.log("Unsolvable");
        return null;
    }

    return (aStar(map));
}

module.exports = solve;