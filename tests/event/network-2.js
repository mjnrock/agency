import Registry from "../../src/Registry";
import Emitter from "../../src/event/Emitter";
import Network from "../../src/event/Network";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

function consoleTracer(end, payload) {
    let trace = [ ...payload.provenance ].map(e => map.get(e.id)).join("->");
    return `${ trace }::${ end }`;
}

const world = new Emitter();
const nodeManager = new Network({ pairBinding: true });

nodeManager.join(world);
// world.addSubscriber(nodeManager);

const nodes = new Registry();
Emitter.Factory({
    amount: 10,
    each: (emitter, i) => {
        nodes.register(emitter, `emitter${ i }`);
        nodeManager.join(emitter);
    },
});

// nodeManager.addSubscriber((...args) => {
//     console.log("S", ...args);
// });
// nodeManager.addHandler("join", (...args) => {
//     console.log("H", ...args);
// });
world.addHandler("join", (...args) => {
    console.log("Hw", ...args);
});

const entity = { name: "bob" };
world.$.emit("join", world, entity);

console.log(nodes.emitter0)
nodes.emitter0.$.emit("join", { cats: 2 });