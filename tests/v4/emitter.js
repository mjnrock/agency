import Emitter from "../../src/v4/Emitter";
import Watcher from "../../src/v4/Watcher";

const emitter = new Emitter({
    test: (a, b) => +a + +b,
});

const watcher = new Watcher(emitter);
watcher.$.subscribe((...args) => { console.log(...args); });
// watcher.$.subscribe(function(...args) { console.log(this, ...args); });

emitter.$.emit("test", 2, 3);
emitter.$test(2, 3);