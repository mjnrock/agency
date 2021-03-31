import Registry from "../../src/Registry";
import Emitter from "../../src/event/Emitter";
import Network from "../../src/event/Network";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const lowerNetwork = new Network();
const upperNetwork = new Network();
const registry = new Registry();

upperNetwork.join(lowerNetwork);
upperNetwork.onEvent = function(...args) { console.log("UPPER", ...args) };
lowerNetwork.onEvent = function(...args) { console.log("LOWER", ...args) };

console.log("--------------------")
console.log(`[LowerNetwork]`, lowerNetwork.id)
console.log(`[UpperNetwork]`, upperNetwork.id)
console.log(`[Registry]`, registry.id)

Emitter.Factory({
    amount: 5,
    each: (emitter, i) => {
        registry.register(emitter, `emitter${ i }`);
        lowerNetwork.join(emitter);
        
        console.log(`[Emitter${ i }]`, emitter.id);
    },
});

console.log("--------------------")

let i = 0;
for(let emitter of lowerNetwork) {
    emitter.$.emit("test", i, Math.random());
}

console.log("----------")
i = 0;
for(let emitter of lowerNetwork) {
    emitter.$.emit("cats", i, Math.random());
    ++i;
    console.log("---")
}