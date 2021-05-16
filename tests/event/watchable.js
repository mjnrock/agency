import Network from "./../../src/event/Network";
import Watchable from "./../../src/event/Watchable";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const mainnet = new Network({}, {
    default: {
        "**": msg => console.log(msg),
    },
});

const watch = new Watchable(mainnet, {
    cat: 5,
    rand: () => Math.random(),
    dogs: {
        roofus: 1,
    },
    _test: 234523,
}, {
    isStateSchema: true,
    emitProtected: true,
    emitPrivate: true,
});

console.log(`[State]:`, watch);
console.warn(`------------------------------------------------`);

watch._cat = 15;
watch.__cats = 150;
// console.log(`[$.cat]:`, watch);
// console.warn(`------------------------------------------------`);

// watch.dogs.roofus = 99;
// console.log(`[$.dogs.roofus]:`, watch);
// console.warn(`------------------------------------------------`);

// watch.fish = {
//     a: 9,
//     b: 8,
//     c: {
//         moreFish: true,
//         nested: {
//             yes: false,
//         },
//     },
// };
// console.log(`[$.fish]:`, watch);
// console.warn(`------------------------------------------------`);

// console.warn(`------------------------------------------------`);
// console.log(`[State]:`, watch);