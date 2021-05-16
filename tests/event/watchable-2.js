import Network from "../../src/event/Network";
import { Factory } from "../../src/event/Watchable";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Network({}, {
    default: {
        "**": msg => console.log(msg),
        // [ Watchable.ControlType.READ ]: msg => console.log(msg),
    },
});

const watch = Factory(network, [{
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
    // useControlMessages: true,
}], 1);
// const watch = Factory(mainnet, [{ rand: () => Math.random() }, { isStateSchema: true }], 5);

console.log(watch.toSchemaObject(true));
// console.log(watch.toBuffer({ all: "*" }).toString());
// console.log(watch.toString({ all: 4444 }));
// console.log(watch.toString({
//     primary: "+++",
//     secondary: "---",
// }));
// console.log(Watchable.Flatten(watch));     // This should invoke a READ with @useControlMessages
// console.log(Watchable.Unflatten(network, Watchable.Flatten(watch)));     // This should invoke a READ with @useControlMessages

// watch.dogs = 15;
// watch.hjdskfjk = 13;
// watch.dogs.fish = {
//     yes: false,
// };
// watch.dogs.fish = {
//     what: "ok",
// };
// delete watch.dogs;

// console.log(watch.dogs.fish.yes)
// console.log(watch.dogs)
// console.log(watch[ "dogs.fish.what" ])
// console.log(watch[ "cats" ])
// console.log(watch.id)
// console.log(watch.__id)
// console.log(flatten(watch))
// console.log(unflatten(flatten(watch)))

// const obj = new Watchable(network, flatten(watch));
// obj.cats = 69;
// const obj = flatten(watch, { asArray: true });
// const uobj = new Watchable(network, unflatten(obj));

// console.log(watch)
// console.log(obj)
// console.log(uobj)