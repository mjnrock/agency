import Network from "../../src/event/Network";
import Watchable, { Factory, AsyncFactory } from "../../src/event/Watchable";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Network({}, {
    default: {
        "**": msg => console.log(msg),
        // [ Watchable.ControlType.READ ]: msg => console.log(msg),
    },
});


const factory = Watchable.Factory(network, [{
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
// }], 1, true);
}], 1, "async");

// console.log(factory(null, 5));
// console.log(factory());

factory(null, 5).then(results => {
    console.log(results);
});
factory().then(results => {
    console.log(results);
});


// const asyncFactory = AsyncFactory(network, [{
//     rand: () => Math.random(),
//     cats: 43,
//     dogs: {
//         cats: 4,
//         fish: {
//             yes: true,
//             what: Math.random(),
//         },
//     },
// }, {
//     isStateSchema: true,
//     // useControlMessages: true,
// }], 1, true);

// asyncFactory.then(asyncFact => {
//     asyncFact(null, 5).then(results => {
//         console.log(results);
//     });
//     asyncFact().then(results => {
//         console.log(results);
//     });
// });