import fetch from "node-fetch";
import Store from "../../src/v2/Store";
import Observer from "../../src/v2/Observer";

const store = new Store(
    {
        cat: 4,
    },
    (state, type, obj) => ({
        type,
        ...obj
    }),
);

// console.log([ ...store.__reducers.values() ].map(fn => fn.toString()))

const obs = new Observer(store);
obs.on("next", (state, { current }) => console.log(`OBSERVER`, current));

// console.log(store.cat);
// store.cat = 15;
// // console.log(store.cat);
// store.dispatch(23138);
// console.log(store);
// store.dispatch("dog", 56);
// store.dispatch("cat", 99);
// store.dispatch("cas", 199);
// console.log(store);

// store.fetchDispatch("http://api.open-notify.org/iss-now.json", {}, "catsss");
store.promiseDispatch(fetch("http://api.open-notify.org/iss-now.json").then(resp => resp.json()));