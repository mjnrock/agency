import Pulse from "./../../src/v4/Pulse";
import Watchable from "./../../src/v4/Watchable";
import Util from "./../../src/v4/util/package";

import Node from "./ba/Node";
import NodeManager from "./ba/NodeManager";

console.log("------------ NEW EXECUTION CONTEXT ------------");

const nm = new NodeManager([ 5, 5 ]);

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
    entity1.position = {
        ...entity1.position,
        x: Util.Dice.roll(1, 5, -1),
        y: Util.Dice.roll(1, 5, -1),
    }
    entity2.position = {
        ...entity2.position,
        x: Util.Dice.roll(1, 5, -1),
        y: Util.Dice.roll(1, 5, -1),
    }
    // [ entity1.position.x, entity1.position.y ] = [ Util.Dice.roll(1, 5, -1), Util.Dice.roll(1, 5, -1) ];
    // [ entity2.position.x, entity2.position.y ] = [ Util.Dice.roll(1, 5, -1), Util.Dice.roll(1, 5, -1) ];
    // entity1.position.x = Util.Dice.roll(1, 5, -1);
    // entity1.position.y = Util.Dice.roll(1, 5, -1);
    // entity2.position.x = Util.Dice.roll(1, 5, -1);
    // entity2.position.y = Util.Dice.roll(1, 5, -1);

    console.clear()
    // console.log(nm.range(0, 0, 5, 5).map(n => [ n._occupants.size, n._frequency ].toString()))
    console.log(nm.range(0, 0, 5, 5).map(n => n._frequency))
    console.log(nm.range(0, 0, 5, 5).map(n => n._occupants.size))
});

entity1.$.subscribe((prop, value) => {
    if(prop.includes("position")) {
        nm.move(entity1, entity1.position.x, entity1.position.y);
    }
});
entity2.$.subscribe((prop, value) => {
    if(prop.includes("position")) {
        nm.move(entity2, entity2.position.x, entity2.position.y);
    }
});