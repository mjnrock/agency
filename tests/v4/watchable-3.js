import Watchable from "../../src/v4/Watchable";
import Pulse from "../../src/v4/Pulse";
import Registry from "../../src/v4/Registry";

console.log("------------ NEW EXECUTION CONTEXT ------------");

const ob = new Watchable({
    obj: new Watchable(),
    reg: new Registry(),
});
ob.$.subscribe((...args) => { console.log(...args); });
// ob.$.subscribe(function(...args) { console.log(this, ...args); });

ob.obj.a = new Watchable({
    inside: 1,
    nested: {
        nested1: 50,
        layer1: {
            layer2: {
                sup: 0
            }
        }
    }
});

// let run  = false;
// const pulse = new Pulse(1, { autostart: true });
// pulse.$.subscribe(function(prop, value) {
//     run = !run;

//     if(run) {
//         // ob.obj.a.inside = 3;
//         // ob.obj.a.nested.nested1 = 3;
//         // ob.obj.a.nested.layer1.layer2 = 3;
//         ob.obj.a.nested.layer1.layer2.sup = 3;
//     } else {
//         // ob.obj.a.inside = 5;
//         // ob.obj.a.nested.nested1 = 5;
//         // ob.obj.a.nested.layer1.layer2 = 5;
//         ob.obj.a.nested.layer1.layer2.sup = 5;
//     }

//     // console.clear();
//     // console.log([ ...ob.__subscribers.keys() ]);
//     // console.log([ ...ob.obj.__subscribers.keys() ]);
// });

let run  = false;
const pulse = new Pulse(1, { autostart: true });
pulse.$.subscribe(function(prop, value) {
    run = !run;

    if(run) {
        ob.reg.register(new Watchable({
            nested: {
                layer1: {
                    layer2: {
                        sup: 0
                    }
                }
            }
        }), "test");
    } else {
        ob.reg.unregister("test")
    }

    console.clear();
    console.log([ ...ob.__subscribers.keys() ]);
    console.log([ ...ob.reg.__subscribers.keys() ]);
    console.log(ob.reg.keys);
});