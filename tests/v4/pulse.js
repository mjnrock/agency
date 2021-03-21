import Pulse from "./../../src/v4/Pulse";
import Watcher from "./../../src/v4/Watcher";

const pulse = new Pulse(2);

const watcher = new Watcher(pulse);
watcher.$.subscribe((...args) => { console.log(...args); });
// watcher.$.subscribe(function(...args) { console.log(this, ...args); });

pulse.start();