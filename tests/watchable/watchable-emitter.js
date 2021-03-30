import Watchable from "../../src/v4/Watchable";
import Watcher from "../../src/v4/Watcher";
import Pulse from "../../src/v4/Pulse";
import Emitter from "../../src/v4/Emitter";

console.log("------------ NEW EXECUTION CONTEXT ------------");

const ob = new Watchable();
ob.$.subscribe((...args) => { console.log(...args); });
// ob.$.subscribe(function(...args) { console.log(this, ...args); });

let A = new Watchable({
    inside: 1,
    nested: {
        layer1: {
            layer2: {
                sup: 0,
                emitter: new Emitter([
                    "cat",
                ]),
                // ], { namespace: Infinity }),
            }
        }
    }
});

ob.a = A;

const obs = new Watcher();
obs.$.on("cat", (...args) => console.log("CATTTTT"));
obs.$.watch(ob.a);

console.log(ob.a.nested.layer1.layer2.emitter.$.events)

let run  = false;
const pulse = new Pulse(1, { autostart: true });
pulse.$.subscribe(function(prop, value) {
    run = !run;

    if(run) {
        ob.a.nested.layer1.layer2.sup = Math.random();
    } else {
        ob.a.nested.layer1.layer2.emitter.$cat("cheese");
        ob.a.nested.layer1.layer2.emitter.$.emit("cat", "cheese");
    }
});