import Store from "../../src/v2/Store";
import Observer from "../../src/v2/Observer";

const store = new Store({
    cat: 4,
}, {
    reducers: [
        (state, no) => ({
            ...state,
            cat: no,
        })
    ],
});

const obs = new Observer(store);
obs.on("next", (...args) => console.log(`OBSERVER`, ...args));

// console.log(store.cat);
store.cat = 15;
// console.log(store.cat);
store.process(23138);
console.log(store);