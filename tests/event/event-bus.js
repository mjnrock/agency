import { performance } from "perf_hooks";

import Network from "./../../src/event/Network";
import Emitter from "./../../src/event/Emitter";

function consoleProcessor(payload) {
    return [ payload.type, map.get(payload.emitter.id), performance.now() ];
    // return [ payload.type, payload.emitter.id.slice(0, 8), performance.now() ];
}

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const GLOBALS = {
    Cats: 2,
};

Network.$.bus.useBatchProcess();
// Network.$.bus.useRealTimeProcess();

console.log(Network.$.bus.id);

const e1 = new Emitter();
const e2 = new Emitter();

const map = new Map();
map.set(e1.id, 1);
map.set(e2.id, 2);

console.log("------- ID LOOKUP -------")
console.log(`[e1]`, e1.id.slice(0, 8))
console.log(`[e2]`, e2.id.slice(0, 8))

Network.$.bus.createContexts([
    [ "default", {
        globals: GLOBALS,
        handlers: {
            "*": function(event, args, globals) { console.log(`[Default*]:`, consoleProcessor(this)) },
            // dog: function(args, globals) { console.log(`[Default*]:`, consoleProcessor(this)) },
            cat: function(args, globals) {
                console.log(`[Default]:`, consoleProcessor(this));

                e1.$.emit("fish1", 5);
                e2.$.emit("fish2", 6);
            },
        },
        isBatchProcess: true,
        // isBatchProcess: false,
    }],
    [ "context1", {
        globals: GLOBALS,
        handlers: {
            "*": function(event, args, globals) { console.log(`[Context-1*]:`, consoleProcessor(this)) },
        },
        isBatchProcess: true,
        // isBatchProcess: false,
    }],
    [ "context2", {
        globals: GLOBALS,
        handlers: {
            "*": function(event, args, globals) { console.log(`[Context-2*]:`, consoleProcessor(this)) },
        },
        isBatchProcess: true,
        // isBatchProcess: false,
    }],
]);

Network.$.bus.createRoutes([
    payload => {
        if(payload.emitter.id === e1.id) {
            return [ "default", "context1" ];
        } else if(payload.emitter.id === e2.id) {
            return [ "default", "context2" ];
        }
    },
    () => "default",
]);

Network.$.fire("bunnies", 432);

console.warn("----- Begin Emitting -----");

e1.$.emit("cat", 1);
e1.$.emit("dog", 2);
e2.$.emit("cat", 3);
e2.$.emit("dog", 4);

console.warn("----- Begin Processing -----");
Network.$.bus.process();







// Network.$.bus.createContexts([
//     [ "default", {
//         globals: GLOBALS,
//         handlers: {
//             dog: (payload, args, globals) => console.log(`[Default]:`, payload, args, globals),
//             cat: (payload, [ first ], { Cats, enqueue }) => {
//                 console.log(`[Default]:`, payload, first, Cats, enqueue);

//                 e1.$.emit("fish", 89742341);
//                 e2.$.emit("fish", 89742341);
//             },
//         }
//     }],
//     [ "context1", {
//         globals: GLOBALS,
//         handlers: {
//             "*": (payload, args, globals) => console.log(`[Context-1]:`, payload, args, globals),
//             // cat: (payload, args, globals) => console.log(`[Context-1]:`, payload, args, globals),
//         }
//     }],
//     [ "context2", {
//         globals: GLOBALS,
//         handlers: {
//             "*": (payload, args, globals) => console.log(`[Context-2]:`, payload, args, globals),
//             // dog: (payload, args, globals) => console.log(`[Context-2]:`, payload, args, globals),
//         }
//     }],
// ]);

// Network.$.bus.router.createRoutes([
//     payload => {
//         if(payload.emitter.id === e1.id) {
//             // return "context1";
//             return [ "default", "context1" ];
//         } else if(payload.emitter.id === e2.id) {
//             return "context2";
//         }
//     },
//     () => "default",
// ]);

// console.warn("----- Begin Emitting -----");

// e1.$.emit("cat", 123);
// e1.$.emit("dog", 123);
// e2.$.emit("cat", 234);
// e2.$.emit("dog", 234);

// console.warn("----- Begin Processing -----");
// Network.$.bus.process();







// console.log(Network.$.bus);
// console.log(Network.$.bus.id);

// const globalObj = {
//     Cats: 2,
// };
// Network.$.bus.createContexts([
//     [ "test", {
//         globals: globalObj
//     }],
// ]);

// console.log(Network.$.bus);
// console.log(Network.$.bus.test);
// console.log(Network.$.bus.test.globals);

// const e1 = new Emitter();
// e1.addHandler("*", function(...args) { return Network.$.bus.test.bus(this, ...Network.$.bus.test); });

// Network.$.bus.joinContext("test", e1, "sobriquet");

// console.log(Network.$.bus.test)
// console.log(Network.$.bus.test.sobriquet)

// e1.$.emit("cat", 123);
// e1.$.emit("cat", 123);
// e1.$.emit("cat", 123);

// Network.$.bus.test.process();