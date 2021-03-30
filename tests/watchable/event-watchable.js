import EventEmitter from "events";

import EventWatchable from "../../src/v4/EventWatchable";

const ee = new EventEmitter();
const ew = new EventWatchable(ee, [ "test1", "test2" ]);

ew.$.subscribe((...args) => { console.log(...args); });
// ew.$.subscribe(function(...args) { console.log(this, ...args); });

ee.broadcast("test1", 1);
ee.broadcast("test2", 0);
ee.broadcast("test1", 1);
ee.broadcast("test2", 0);