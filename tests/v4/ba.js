import Pulse from "./../../src/v4/Pulse";
import Watchable from "./../../src/v4/Watchable";
import Util from "./../../src/v4/util/package";

import World from "./ba/World";
import Portal from "./ba/Portal";

console.log("------------ NEW EXECUTION CONTEXT ------------");

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

const world = new World([ 5, 5 ]);

world.open(0, 0, new Portal(world, world.width - 1, world.height - 1));
world.open(~~(world.width / 2), ~~(world.height / 2), new Portal(world, world.width - 1, world.height - 1));

const loop = new Pulse(1, { autostart: true });
loop.$.subscribe((prop, { dt, now }) => {
    entity1.position = {
        ...entity1.position,
        x: Util.Dice.roll(1, world.width, -1),
        y: Util.Dice.roll(1, world.height, -1),
    }
    entity2.position = {
        ...entity2.position,
        x: Util.Dice.roll(1, world.width, -1),
        y: Util.Dice.roll(1, world.height, -1),
    }

    console.clear();
    console.log(world._nodes.range(0, 0, world.width, world.height, { asGrid: true }).map(r => r.map(n => n._frequency)));
    console.log(world._nodes.range(0, 0, world.width, world.height, { asGrid: true }).map(r => r.map(n => n._occupants.size ? `X` : (n._portals.size ? `O` : `-`))));
});

entity1.$.subscribe((prop, value) => {
    if(prop.includes("position")) {
        world._nodes.move(entity1, entity1.position.x, entity1.position.y);
    }
});
entity2.$.subscribe((prop, value) => {
    if(prop.includes("position")) {
        world._nodes.move(entity2, entity2.position.x, entity2.position.y);
    }
});