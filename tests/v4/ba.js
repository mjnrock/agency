import Pulse from "./../../src/v4/Pulse";
import Emitter from "../../src/v4/Emitter";
import Util from "./../../src/v4/util/package";

import World from "./ba/World";
import Portal from "./ba/Portal";

console.log("------------ NEW EXECUTION CONTEXT ------------");

function createEntities(world, count = 1) {
    const entities = [];
    for(let i = 0; i < count; i++) {
        entities.push(createEntity(world));
    }

    return entities;
};
function createEntity(world) {
    const entity = new Emitter([], {
        state: {
            name: Math.random(),
            position: Util.Helper.seedObject([ "world", "x", "y" ]),
        }
    });

    world.joinWorld(entity);

    return entity;
};
function createWorld(size = [], opts = {}) {
    const world = new World(size, opts);

    world.$.on(world.$.event("join"), function([ world, entity ]) {
        if(entity.position.world !== world) {
            entity.position.world = world;
            entity.position.x = world.config.spawn[ 0 ];
            entity.position.y = world.config.spawn[ 1 ];
        }
    });

    const nodeManager = world.nodes;
    nodeManager.$.on(
        World.GetEvent(opts.namespace, "join"),
        function([ entity ]) {
            nodeManager.cache.set(entity,  [ entity.position.x, entity.position.y ]);
        },
    );
    nodeManager.$.on(
        World.GetEvent(opts.namespace, "portal"),
        function([ portal, entity ]) {
            if(entity.position.world) {
                entity.position.world.leaveWorld(entity);
            }
    
            entity.position.world = portal.world;
            portal.world.joinWorld(entity);
            
            entity.position.x = portal.x;
            entity.position.y = portal.y;
        },
    );

    return world;
};

const Game = {
    loop: new Pulse(1, { autostart: true }),
    player: new Emitter([], {
        state: {
            name: "Buddhiszka",
            position: Util.Helper.seedObject([ "world", "x", "y" ]),
        }
    }),
};

const world1 = createWorld([ 6, 6 ], {
    config: { spawn: [ 4, 4 ] },
});
const world2 = createWorld([ 5, 5 ], {
    config: { spawn: [ 3, 3 ] },
});

world1.openPortal(0, 1, new Portal(world2));
world2.openPortal(1, 0, new Portal(world1));

createEntities(world1, 5);
createEntities(world2, 2);

Game.world = world1;
Game.world.LAST_MESSAGE = "";
Game.world.joinWorld(Game.player);

Game.player.$.subscribe((prop, value) => {
    if(prop === "position.world") {
        Game.world = Game.player.position.world || Game.world;
    }
});

// console.log(Game.world)

Game.loop.$.subscribe((prop, { dt, now }) => {
    console.clear();
    // Game.player.position.x = Util.Dice.roll(1, Game.world.width, -1),
    // Game.player.position.y = Util.Dice.roll(1, Game.world.height, -1),
    // Game.world.nodes.move(Game.player, Game.player.position.x, Game.player.position.y);
    
    // Game.world = Game.player.position.world || Game.world;
    for(let entity of Game.world.entities) {
        entity.position.x = Util.Dice.roll(1, Game.world.width, -1);
        entity.position.y = Util.Dice.roll(1, Game.world.height, -1);
        // if(entity === Game.player) {
        //     entity.position.x = Util.Dice.roll(1, 2, -1);
        //     entity.position.y = Util.Dice.roll(1, 2, -1);
        // } else {
        //     entity.position.x = Util.Dice.roll(1, Game.world.width, -1);
        //     entity.position.y = Util.Dice.roll(1, Game.world.height, -1);
        // }

        Game.world.nodes.move(entity, entity.position.x, entity.position.y);
    }

    Game.world.LAST_MESSAGE = [ Game.player.position.x, Game.player.position.y ].toString();

    // console.log(`----- Tick -----`);
    console.log(Game.player);
    console.log(Game.world.nodes.range(0, 0, Game.world.width, Game.world.height, { asGrid: true }).map(r => r.map(n => n._frequency)));
    console.log(Game.world.nodes.range(0, 0, Game.world.width, Game.world.height, { asGrid: true }).map(r => r.map(n => {
        const icons = [];
        for(let e of n.occupants) {
            if(e === Game.player) {
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
    console.log(`[Entities]:`, Game.world.entities.$.size)
    console.log(`[Player]: `, Game.world.LAST_MESSAGE);
    // console.log(`----------------`);
    // console.log(Game.world.__subscribers);
    // console.log(`----------------`);
});