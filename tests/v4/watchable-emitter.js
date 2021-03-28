import Watchable from "../../src/v4/Watchable";
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
            }
        }
    }
});

ob.a = A;

console.log(ob.a.nested.layer1.layer2.emitter)

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