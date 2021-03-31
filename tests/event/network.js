import Registry from "../../src/Registry";
import Emitter from "../../src/event/Emitter";
import Network from "../../src/event/Network";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

function consoleTracer(end, payload) {
    let trace = [ ...payload.provenance ].map(e => map.get(e.id)).join("->");
    return `${ trace }::${ end }`;
}

// const lowerNetwork = new Network();
const lowerNetwork = new Network({ pairBinding: true });
// const upperNetwork = new Network();
const upperNetwork = new Network({ pairBinding: true });
const registry = new Registry();

const map = new Map();
map.set(lowerNetwork.id, "LowerNetwork");
map.set(upperNetwork.id, "UpperNetwork");
map.set(registry.id, "Registry");

console.log("------- ID LOOKUP -------")
console.log(`[LowerNetwork]`, lowerNetwork.id.slice(0, 8))
console.log(`[UpperNetwork]`, upperNetwork.id.slice(0, 8))
console.log(`[Registry]`, registry.id.slice(0, 8))

Emitter.Factory({
    amount: 5,
    each: (emitter, i) => {
        registry.register(emitter, `emitter${ i }`);
        lowerNetwork.join(emitter);
        
        map.set(emitter.id, `Emitter${ i }`);

        // emitter.addSubscriber(function(...args) { console.log(`S==> [${ consoleTracer(`Emitter${ i }`, this) }]:`, ...args) });
        emitter.addHandler("*", function(...args) { console.log(`*==> [${ consoleTracer(`Emitter${ i }`, this) }]:`, ...args) });
        
        console.log(`[Emitter${ i }]`, emitter.id.slice(0, 8));
    },
});

upperNetwork.join(lowerNetwork);
// lowerNetwork.join(upperNetwork);    //! TEST:   This circular loop should NOT break this, due to provenance

console.log("--------------------")

// lowerNetwork.addSubscriber(function(...args) { console.log(`S==> [${ consoleTracer(`LowerNetwork`, this) }]:`, ...args) });
// upperNetwork.addSubscriber(function(...args) { console.log(`S==> [${ consoleTracer(`UpperNetwork`, this) }]:`, ...args) });
lowerNetwork.addHandler("*", function(...args) { console.log(`*==> [${ consoleTracer(`LowerNetwork`, this) }]:`, ...args) });
upperNetwork.addHandler("*", function(...args) { console.log(`*==> [${ consoleTracer(`UpperNetwork`, this) }]:`, ...args) });

for(let emitter of registry) {
    console.log(`=>`, map.get(emitter.id))
    emitter.$.emit("jkhasdfkjhd", Math.random());
    console.log("---")
}

console.log("--------------------")
lowerNetwork.fire("cats", Date.now())

// let network = lowerNetwork;
// // let network = upperNetwork;

// for(let emitter of network) {
//     console.log(`=>`, map.get(emitter.id))
//     emitter.$.emit("test", Math.random());
//     console.log("---")
// }

// console.log("----------")
// for(let emitter of network) {
//     console.log(`=>`, map.get(emitter.id))
//     emitter.$.emit("cats", Math.random());
//     console.log("---")
// }