import Network from "../../src/event/Network";
import Watchable, { Factory } from "../../src/event/Watchable";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const mainnet = new Network({}, {
    default: {
        "**": msg => console.log(msg),
    },
});

const watch = Factory(mainnet, [{ rand: () => Math.random() }, { isStateSchema: true, useControlMessages: true }], 1);
// const watch = Factory(mainnet, [{ rand: () => Math.random() }, { isStateSchema: true }], 5);

console.log(watch);     // This should invoke a READ with @useControlMessages

watch.dogs = 15;
watch.dogs = 13;
watch.dogs = 11;
delete watch.dogs;