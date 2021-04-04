import EventBus from "./../../src/event/EventBus";
import Emitter from "./../../src/event/Emitter";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const GLOBALS = {
    Cats: 2,
};

console.log(EventBus.$.id);

EventBus.$.createChannels([
    [ "test", {
        globals: GLOBALS,
        handlers: {
            dog: (payload, args, globals) => console.log(payload, args, globals),
            cat: (payload, [ first ], { Cats }) => console.log(payload, first, Cats),
        }
    }],
]);

EventBus.$.router.createRoutes([
    (payload, event, ...args) => {
        return "test";
    }
]);

const e1 = new Emitter();

e1.$.emit("cat", 123);
e1.$.emit("dog", 123);

EventBus.$.test.process();







// console.log(EventBus.$);
// console.log(EventBus.$.id);

// const globalObj = {
//     Cats: 2,
// };
// EventBus.$.createChannels([
//     [ "test", {
//         globals: globalObj
//     }],
// ]);

// console.log(EventBus.$);
// console.log(EventBus.$.test);
// console.log(EventBus.$.test.globals);

// const e1 = new Emitter();
// e1.addHandler("*", function(...args) { return EventBus.$.test.bus(this, ...EventBus.$.test); });

// EventBus.$.joinChannel("test", e1, "sobriquet");

// console.log(EventBus.$.test)
// console.log(EventBus.$.test.sobriquet)

// e1.$.emit("cat", 123);
// e1.$.emit("cat", 123);
// e1.$.emit("cat", 123);

// EventBus.$.test.process();