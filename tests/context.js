import Proposition from "../Proposition";
import Mutator from "../Mutator";
import Context from "../Context";

const ctx = new Context({
    cats: 2,
}, [
    [
        state => ({
            ...state,
            _now: Date.now(),
        }),
        (...args) => {
            console.log(...args);

            return true;
        }
    ]
]);

ctx.run(1, "fish");
console.log(ctx.state);



//* Synonymous Usage Examples
// //* Ex. 1
// const ctx = new Context({
//     cats: 2,
// }, [
//     [
//         state => ({
//             ...state,
//             _now: Date.now(),
//         }),
//         (...args) => {
//             console.log(...args);

//             return true;
//         }
//     ]
// ]);

// //* Ex. 2
// const ctx = new Context({
//     cats: 2,
// });
// ctx.attach(
//     state => ({
//         ...state,
//         _now: Date.now(),
//     }),
//     (...args) => {
//         console.log(...args);

//         return true;
//     }
// );

// //* Ex. 3
// const ctx = new Context({
//     cats: 2,
// });
// ctx.attach(
//     new Mutator(state => ({
//         ...state,
//         _now: Date.now(),
//     })),
//     new Proposition((...args) => {
//         console.log(...args);

//         return true;
//     })
// );