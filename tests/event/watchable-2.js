import Network from "../../src/event/Network";
import Watchable, { Factory } from "../../src/event/Watchable";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const mainnet = new Network({}, {
    default: {
        "**": msg => console.log(msg),
    },
});

// const watch = Factory(mainnet, [{ rand: () => Math.random() }, { isStateSchema: true }], 1);
const watch = Factory(mainnet, [{ rand: () => Math.random() }, { isStateSchema: true }], 5);

console.log(watch);