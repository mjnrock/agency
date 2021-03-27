import Pulse from "./../../src/v4/Pulse";
import Watchable from "./../../src/v4/Watchable";
import Util from "./../../src/v4/util/package";

import World from "./ba/World";
import Portal from "./ba/Portal";

console.log("------------ NEW EXECUTION CONTEXT ------------");

const player = new Watchable({
    name: "Bob",
    position: {
        world: null,
        x: 0,
        y: 0,
    }
});

const Game = {
    loop: new Pulse(1, { autostart: true }),
    entities: [
        player,
    ],
};

const world1 = new World([ 2, 2 ], {
    entities: Game.entities,
    config: { spawn: [ 0, 0 ] },
});
const world2 = new World([ 2, 2 ], {
    config: { spawn: [ 0, 0 ] },
});

world1.open(0, 1, new Portal(world2));
world2.open(1, 0, new Portal(world1));

Game.world = world1;
Game.world.LAST_MESSAGE = "";

Game.loop.$.subscribe((prop, { dt, now }) => {
    Game.world = player.position.world || Game.world;

    player.position.x = Util.Dice.roll(1, Game.world.width, -1),
    player.position.y = Util.Dice.roll(1, Game.world.height, -1),
    
    // Game.entities.forEach(entity => {
    //     entity.position = {
    //         ...entity.position,
    //         // x: Util.Dice.roll(1, Game.world.width, -1),
    //         // y: Util.Dice.roll(1, Game.world.height, -1),
    //         x: Util.Dice.roll(1, 2, -1),
    //         y: Util.Dice.roll(1, 2, -1),
    //     };

    //     Game.world.nodes.move(entity, entity.position.x, entity.position.y);
    // });

    Game.world.nodes.move(player, player.position.x, player.position.y);
    Game.world.LAST_MESSAGE = [ player.position.x, player.position.y ].toString();

    console.clear();
    console.log(Game.world.nodes.range(0, 0, Game.world.width, Game.world.height, { asGrid: true }).map(r => r.map(n => n._frequency)));
    console.log(Game.world.nodes.range(0, 0, Game.world.width, Game.world.height, { asGrid: true }).map(r => r.map(n => n._occupants.size ? `x` : (n._portals.size ? `O` : `-`))));
    console.log(`[World]:`, Game.world.id)
    console.log(`[Message]: `, Game.world.LAST_MESSAGE);
    // console.log(`----------------`);
    // console.log(Game.world.__subscribers);
    // console.log(`----------------`);
});