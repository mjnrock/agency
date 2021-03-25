import Pulse from "./../../src/v4/Pulse";
import Watchable from "./../../src/v4/Watchable";
import Util from "./../../src/v4/util/package";

import Node from "./ba/Node";
import NodeManager from "./ba/NodeManager";

console.log("------------ NEW EXECUTION CONTEXT ------------");

const nm = new NodeManager([ 5, 5 ]);

// const nodes = nm.range(0, 0, 3, 3, { asGrid: true });
// console.log(nodes);

const entity1 = new Watchable({
    name: "Kiszka",
    position: {
        x: 0,
        y: 0,
    }
});
const entity2 = new Watchable({
    name: "Buddha",
    position: {
        x: 0,
        y: 0,
    }
});

const loop = new Pulse(1, { autostart: true });
loop.$.subscribe((prop, { dt, now }) => {
    entity1.position.x = Util.Dice.roll(1, 6, -1);
    entity1.position.y = Util.Dice.roll(1, 6, -1);
    entity2.position.x = Util.Dice.roll(1, 6, -1);
    entity2.position.y = Util.Dice.roll(1, 6, -1);
});

entity1.$.subscribe((prop, value) => {
    if(prop.includes("position")) {
        console.log(nm.cached(entity1))
        nm.move(entity1, entity1.position.x, entity1.position.y);
    }
});
entity2.$.subscribe((prop, value) => {
    if(prop.includes("position")) {
        console.log(nm.cached(entity2))
        nm.move(entity2, entity2.position.x, entity2.position.y);
        console.log(nm.cache.get(entity2))
    }
});

// console.log(nm.range(0, 0, 5, 5));

// nm.move(entity1, 1, 1);
// // nm.node(1, 1).join(entity1);
// // nm.move(entity2, 2, 2);
// // nm.node(2, 2).join(entity2);
// nm.move(entity1, 2, 2);
// nm.move(entity1, 3, 3);

// console.log(nm.node(1, 1)._occupants)
// console.log(nm.node(2, 2)._occupants)
// console.log(nm.node(3, 3)._occupants)