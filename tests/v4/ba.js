import Pulse from "./../../src/v4/Pulse";
import Watchable from "./../../src/v4/Watchable";
import Util from "./../../src/v4/util/package";

import World from "./ba/World";
import Portal from "./ba/Portal";

console.log("------------ NEW EXECUTION CONTEXT ------------");

const player = new Watchable({
    name: "Bob",
    position: Util.Helper.seedObject([ "world", "x", "y", "cat.dog", "cat.fish", "cat.fish.a" ]),
});

// console.log(JSON.stringify(Util.Helper.seedObject([ "world", "x", "y", "cat.dog", "cat.fish", "cat.fish.a" ], () => 1)));
console.log(Util.Helper.round(1.005, 1000))
console.log(Util.Helper.round(1.005, 100))
console.log(Util.Helper.round(1.005, 10))
console.log(Util.Helper.round(Util.Helper.round(Util.Helper.round(Util.Helper.round(15.5498, 10000), 1000), 100), 10))

function createEntities(world, count = 1) {
    const entities = [];
    for(let i = 0; i < count; i++) {
        entities.push(createEntity(world));
    }

    return entities;
}
function createEntity(world) {
    const entity = new Watchable({
        name: Math.random(),
        position: Util.Helper.seedObject([ "world", "x", "y" ]),
    });

    world.join(entity);
}

const Game = {
    loop: new Pulse(1, { autostart: true }),
    entities: [
        player,
    ],
};

const world1 = new World([ 6, 6 ], {
    entities: Game.entities,
    config: { spawn: [ 4, 4 ] },
});
const world2 = new World([ 5, 5 ], {
    config: { spawn: [ 3, 3 ] },
});

createEntities(world1, 20);
createEntities(world2, 10);

world1.open(0, 1, new Portal(world2));
world2.open(1, 0, new Portal(world1));

Game.world = world1;
Game.world.LAST_MESSAGE = "";

Game.loop.$.subscribe((prop, { dt, now }) => {
    Game.world = player.position.world || Game.world;

    // player.position.x = Util.Dice.roll(1, Game.world.width, -1),
    // player.position.y = Util.Dice.roll(1, Game.world.height, -1),
    
    Game.world.entities.values.forEach(entity => {
        if(entity === player) {
            entity.position.x = Util.Dice.roll(1, 2, -1);
            entity.position.y = Util.Dice.roll(1, 2, -1);
        } else {
            entity.position.x = Util.Dice.roll(1, Game.world.width, -1);
            entity.position.y = Util.Dice.roll(1, Game.world.height, -1);
        }

        Game.world.nodes.move(entity, entity.position.x, entity.position.y);
    });

    Game.world.nodes.move(player, player.position.x, player.position.y);
    Game.world.LAST_MESSAGE = [ player.position.x, player.position.y ].toString();

    console.clear();
    console.log(Game.world.nodes.range(0, 0, Game.world.width, Game.world.height, { asGrid: true }).map(r => r.map(n => n._frequency)));
    console.log(Game.world.nodes.range(0, 0, Game.world.width, Game.world.height, { asGrid: true }).map(r => r.map(n => {
        const icons = [];
        for(let e of n.occupants) {
            if(e === player) {
                icons.push(`P`);
            } else {
                icons.push(`E`);
            }
        }

        if(n._portals.size) {
            icons.push(`O`);
        }

        if(icons.length) {
            return icons.join(`,`);
        }

        return `-`;
    })));
    console.log(`[World]:`, `(${ Game.world.id === world1.id ? 1 : 2 }-${ Game.world.width }x${ Game.world.height })`, Game.world.id);
    console.log(`[Entities]:`, Game.world.entities.size)
    console.log(`[Player]: `, Game.world.LAST_MESSAGE);
    // console.log(`----------------`);
    // console.log(Game.world.__subscribers);
    // console.log(`----------------`);
});