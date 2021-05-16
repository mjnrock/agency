import Network from "../../src/event/Network";
import Watchable, { Factory } from "../../src/event/Watchable";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const mainnet = new Network({}, {
    default: {
        "**": msg => console.log(msg),
        // [ Watchable.ControlType.READ ]: msg => console.log(msg),
    },
});

const watch = Factory(mainnet, [{
    rand: () => Math.random(),
    cats: 43,
    dogs: {
        cats: 4,
        fish: {
            yes: true,
            what: Math.random(),
        },
    },
}, {
    isStateSchema: true,
    useControlMessages: true,
}], 1);
// const watch = Factory(mainnet, [{ rand: () => Math.random() }, { isStateSchema: true }], 5);

// console.log(watch);     // This should invoke a READ with @useControlMessages

// watch.dogs = 15;
// watch.hjdskfjk = 13;
watch.dogs.fish = {
    yes: false,
};
// watch.dogs.fish = {
//     what: "ok",
// };
// delete watch.dogs;

// console.log(watch.dogs.fish.yes)
// console.log(watch.dogs)
// console.log(watch[ "dogs.fish.what" ])
// console.log(watch[ "cats" ])
// console.log(watch.cats)