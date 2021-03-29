import { v4 as uuidv4 } from "uuid";

import Network from "../../src/v4/Network";
import Watchable from "../../src/v4/Watchable";
import Emitter from "../../src/v4/Emitter";
import Watcher from "../../src/v4/Watcher";
import Pulse from "../../src/v4/Pulse";

// const network = new Network();
const network = new Network([], {
    namespace: "Cats",
    // parentKey: "bobski",
});
const network2 = new Network([], {
    namespace: "Pumas",
    // parentKey: "bobski",
});

const e1 = new Emitter([
    "cats",
], {
    name: Math.random(),
});
const e2 = new Emitter([
    "cats",
    "dogs",
], {
    name: Math.random(),
});

network.$.subscribe(function(prop, value) {
    console.log(`[Network]:`, this.subject.$.id.slice(0, 8), prop, value);
});
e1.$.subscribe(function(prop, value) {
    console.log(`[E1]:`, this.subject.$.id.slice(0, 8), prop, value);
});


e1.$.emit("cats");

console.log("--- Connecting to Network ---");

network.join(e1);
network.join(e2);
network.fire("cats", "meow");

console.log("--- Adding Network 2 ---");

network2.join(network);
network2.$.subscribe(function(prop, value) {
    console.log(`[Network2]:`, this.subject.$.id.slice(0, 8), prop, value);
});

console.log("--- Starting Event Battery ---");
e1.$.emit("fish");
e1.$.emit("fish");
e1.$.emit("fish");
e2.$.emit("dogs");
e1.$.emit("fish");
e1.$.emit("fish");

e1.name = Math.random();

console.log("--- Adding 'fish' Event ---");

network.addEvent("fish").fire("fish", 1, 2, 4, 5, 9);

console.log("--- E1 Leaving Network ---");

network.leave(e1);
e1.$fish(1234);

// console.log(e1.$.id);
// console.log("----------------------");
// console.log(network);


// console.log("=====");
// console.log("=====");
// console.log("=====");
// console.log("=====");
// console.log("=====");
// console.log("=====");
// console.log("=====");
// console.log(e2);
// console.log("=====");
// console.log(e2[ network.__parentKey ]);
// network.leave(e2);
// console.log(e2[ network.__parentKey ]);
// console.log("=====");
// console.log(e2);

// console.log("=====");
// console.log("=====");
// e2.network = 4;
// console.log(e2)


// // const pulser = Pulse.Watcher(2, {
// //     autostart: true,
// //     pre: (ts, dt) => console.log("pre")
// // });
// // pulser.$.on("tick", ([ dt, now ]) => console.log(dt, now));