import Emitter from "../../src/v4/Emitter";
import Watcher from "../../src/v4/Watcher";

const emitter = new Emitter({
    test: (a, b) => +a + +b,
});

const watcher = new Watcher(emitter);
watcher.$.subscribe((...args) => { console.log(...args); });
// watcher.$.subscribe(function(...args) { console.log(this, ...args); });

emitter.$.handle("cats")            // Should return the @args in ...@args when invoked

emitter.$.emit("test", 2, 3);       // Standard .emit
emitter.$test(2, 3);                // Trapped .emit, bound to "test"
emitter.$cats("Kiszka", "Buddha");  // Should be the result of Emitter.Handler

emitter.$testsss(2, 3);             // Key not present, should return: undefined