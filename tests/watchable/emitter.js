import Emitter from "../../src/v4/Emitter";
import Watchable from "../../src/v4/Watchable";
import Watcher from "../../src/v4/Watcher";

console.log("------------ NEW EXECUTION CONTEXT ------------");

const emitter = new Emitter({
    test: (a, b) => +a + +b,
});

const watcher = new Watcher([ emitter ]);
watcher.$.subscribe((...args) => { console.log(...args); });
// watcher.$.subscribe(function(...args) { console.log(this, ...args); });

// watcher.$.watch(emitter);
emitter.$.handle("cats")            // Should return the @args in ...@args when invoked

emitter.$.emit("test", 2, 3);       // Standard .emit
emitter.$test(2, 3);                // Trapped .emit, bound to "test"
emitter.$cats("Kiszka", "Buddha");  // Should be the result of Emitter.Handler

emitter.$testsss(2, 3);             // Key not present, should return: undefined

console.log(emitter);
console.log(watcher);


// const emitter2 = new Emitter();
// emitter2.$.subscribe((prop, value) => console.log(111, prop, value));
// emitter2.cats = {
//     cat: {
//         cat: 2,
//     },
// };
// emitter2.cats.cat.cat = 5243543;

// class Child extends Watchable {};
// const child = new Child();
// child.$.subscribe((prop, value) => console.log(222, prop, value));
// child.cats = {
//     cat: {
//         cat: 2,
//     },
// };
// child.cats.cat.cat = 5243543;

// const watchable = new Watchable();
// watchable.$.subscribe((prop, value) => console.log(333, prop, value));
// watchable.cats = {
//     cat: {
//         cat: 2,
//     },
// };
// watchable.cats.cat.cat = 5243543;

// console.log("--------------------")
// console.log(emitter2.$.id)
// console.log(child.$.id)
// console.log(watchable.$.id)