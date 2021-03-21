import EventEmitter from "events";

import EventWatchable from "./../../src/EventWatchable";

const ee = new EventEmitter();
const ew = new EventWatchable(ee, [ "test1", "test2" ]);

ew.$.subscribe((...args) => { console.log(...args); });
// ew.$.subscribe(function(...args) { console.log(this, ...args); });

ee.emit("test1", 1);
ee.emit("test2", 0);
ee.emit("test1", 1);
ee.emit("test2", 0);