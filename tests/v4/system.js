import { v4 as uuidv4 } from "uuid";

import System from "./../../src/v4/System";
import Watchable from "./../../src/v4/Watchable";
import Emitter from "./../../src/v4/Emitter";
import Watcher from "./../../src/v4/Watcher";
import Pulse from "./../../src/v4/Pulse";

const system = new System([], {
    // namespace: "Cats",
});

const e1 = new Watchable({
    name: Math.random(),
});
const e2 = new Emitter([
    "cats",
], {
    name: Math.random(),
});

system.$.subscribe(function(prop, value) {
    console.log(`[System]:`, prop, value);
});

system.join(e1);
system.join(e2);

e1.name = Math.random();

system.fire("cats", "meow");

console.log(e1.$.id);


console.log("=====");
console.log("=====");
console.log("=====");
console.log("=====");
console.log("=====");
console.log("=====");
console.log("=====");
console.log(e2);
console.log("=====");
console.log(((e2.system || {}).$ || {}).id);
system.leave(e2);
console.log(((e2.system || {}).$ || {}).id);
console.log("=====");
console.log(e2);

console.log("=====");
console.log("=====");
e2.system = 4;
console.log(e2)


// const pulser = Pulse.Watcher(2, {
//     autostart: true,
//     pre: (ts, dt) => console.log("pre")
// });
// pulser.$.on("tick", ([ dt, now ]) => console.log(dt, now));