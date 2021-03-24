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
emitter.$testsss(2, 3);     // Fails silently




const emitter2 = new Emitter({
    test2: (a, b) => +a + +b,
}, { failSilently: false });

const watcher2 = new Watcher(emitter2);
watcher2.$.subscribe((...args) => { console.log(...args); });
// watcher.$.subscribe(function(...args) { console.log(this, ...args); });

emitter2.$.handle("cats")
emitter2.$.emit("test2", 2, 3);
emitter2.$test2(2, 3);
emitter2.$cats("Kiszka", "Buddha");
try {
    emitter2.$test2222(2, 3);   // Should fail with an error
} catch(e) {
    console.log(`===== Trapped Error =====`);
    console.log(e);
    console.log(`===== /Trapped Error =====`);
}