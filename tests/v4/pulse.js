import MainLoop from "mainloop.js";

import Pulse from "./../../src/v4/Pulse";
import Watcher from "./../../src/v4/Watcher";

const pulse = new Pulse(5);
// pulse.$.subscribe((...args) => console.log(...args));

const watcher = new Watcher([ pulse ]);
watcher.$.subscribe((...args) => { console.log(...args); });
// // watcher.$.subscribe(function(...args) { console.log(this, ...args); });

pulse.cat = 235234;
pulse.start();

// const loop = MainLoop.setUpdate((...args) => console.log(...args))
//     .setSimulationTimestep(1000 / 2);

// loop.start();