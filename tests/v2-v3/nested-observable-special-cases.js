import Observer from "./../../src/v2/Observer";

import World from "./World";

const world = new World();

const obs = new Observer(world);
obs.on("next", (...args) => console.log(`OBS`, ...args.slice(0, 2)));

world.terrain[ `5:5` ] = 6;