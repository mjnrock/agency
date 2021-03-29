import { v4 as uuidv4 } from "uuid";

import Network from "../../src/v4/Network";
import Watchable from "../../src/v4/Watchable";
import Emitter from "../../src/v4/Emitter";
import Watcher from "../../src/v4/Watcher";
import Pulse from "../../src/v4/Pulse";

const network = new Network();
// const system = new Network([], {
//     namespace: "Cats",
// });

const e1 = new Emitter([
    "cats",
], {
    name: Math.random(),
});
const e2 = new Emitter([
    "cats",
], {
    name: Math.random(),
});

network.$.subscribe(function(prop, value) {
    console.log(`[Network]:`, prop, value);
});

network.join(e1);
network.join(e2);

e1.name = Math.random();

network.fire("cats", "meow");

console.log(e1.$.id);
console.log("----------------------");
console.log(network);


// console.log("=====");
// console.log("=====");
// console.log("=====");
// console.log("=====");
// console.log("=====");
// console.log("=====");
// console.log("=====");
// console.log(e2);
// console.log("=====");
// console.log(((e2.system || {}).$ || {}).id);
// system.leave(e2);
// console.log(((e2.system || {}).$ || {}).id);
// console.log("=====");
// console.log(e2);

// console.log("=====");
// console.log("=====");
// e2.system = 4;
// console.log(e2)


// // const pulser = Pulse.Watcher(2, {
// //     autostart: true,
// //     pre: (ts, dt) => console.log("pre")
// // });
// // pulser.$.on("tick", ([ dt, now ]) => console.log(dt, now));