import Emitter from "./../../src/event/Emitter";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const emitter = new Emitter({
    "*": [
        // (...args) => console.log(...args),
        function(...args) { console.log(emitter.id, this, [ ...this.provenance ].map(v => v.id)) },
    ],
    cat: [
        () => true,
        () => false,
    ],
    dog: () => false,
}, {
    relay: () => true,
});


// emitter.addSubscriber((...args) => console.log(83749832, ...args));
// emitter.addSubscriber(function(...args) { console.log(this, ...args) });



const emitter2 = new Emitter({
    "*": [
        function(...args) { console.log(emitter2.id, this, [ ...this.provenance ].map(v => v.id)) },
    ],
    cat: (...args) => console.log(...args),
    dog: (...args) => console.log(...args),
}, {
    relay: () => true,
    // filter: (event, ...args) => event === "cat"
});


const emitter3 = new Emitter({
    "*": [
        function(...args) { console.log(emitter3.id, this, [ ...this.provenance ].map(v => v.id)) },
    ],
}, {
    // relay: () => true,
    // filter: (event, ...args) => event === "cat"
});


console.log(1, emitter.id)
console.log(2, emitter2.id)
console.log(3, emitter3.id)
console.log("-----");

emitter.addSubscriber(emitter2);
emitter2.addSubscriber(emitter3);

// console.log(emitter.__subscribers)
// console.log(emitter2.handlers)
// console.log(emitter3.handlers)

emitter2.$.emit("cat", 1, 2, 3);
emitter2.$.emit("dog", 4, 5, 6);