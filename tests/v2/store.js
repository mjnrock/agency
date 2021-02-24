import Store from "../../src/v2/Store";
import Observer from "../../src/v2/Observer";

const store = new Store({
    cat: 4,
}, {
    reducers: [
        Store.TypedReducer("cat", (state, no) => {
            // console.log(`CAT`, state, "|", no);
            return {
                ...state,
                cat: no,
            };
        }),
        Store.TypedReducer("dog", (state, no) => {
            // console.log(`DOG`, state, "|", no);
            return {
                ...state,
                dog: no,
            };
        }),
    ],
});

// console.log([ ...store.__reducers.values() ].map(fn => fn.toString()))

const obs = new Observer(store);
obs.on("next", (...args) => console.log(`OBSERVER`, ...args));

// console.log(store.cat);
// store.cat = 15;
// // console.log(store.cat);
// store.process(23138);
// console.log(store);
store.process("dog", 56);
store.process("cat", 99);
store.process("cas", 199);
console.log(store);