import EventBus from "./../../src/event/EventBus";
import Emitter from "./../../src/event/Emitter";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const GLOBALS = {
    Cats: 2,
};

console.log(EventBus.$.id);

EventBus.$.createChannels([
    [ "default", {
        globals: GLOBALS,
        handlers: {
            dog: (payload, args, globals) => console.log(`[Default]:`, payload, args, globals),
            cat: (payload, [ first ], { Cats, enqueue }) => console.log(`[Default]:`, payload, first, Cats, enqueue),
        }
    }],
    [ "context1", {
        globals: GLOBALS,
        handlers: {
            "*": (payload, args, globals) => console.log(`[Context-1]:`, payload, args, globals),
            // cat: (payload, args, globals) => console.log(`[Context-1]:`, payload, args, globals),
        }
    }],
    [ "context2", {
        globals: GLOBALS,
        handlers: {
            "*": (payload, args, globals) => console.log(`[Context-2]:`, payload, args, globals),
            // dog: (payload, args, globals) => console.log(`[Context-2]:`, payload, args, globals),
        }
    }],
]);

const e1 = new Emitter();
const e2 = new Emitter();

EventBus.$.router.createRoutes([
    payload => {
        if(payload.emitter.id === e1.id) {
            return "context1";
            return [ "default", "context1" ];
        } else if(payload.emitter.id === e2.id) {
            return "context2";
        }
    },
    () => "default",
]);

console.warn("----- Begin Emitting -----");

e1.$.emit("cat", 123);
e1.$.emit("dog", 123);
e2.$.emit("cat", 234);
e2.$.emit("dog", 234);

console.warn("----- Begin Processing -----");
EventBus.$.process();







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