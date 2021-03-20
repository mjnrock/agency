import Observable from "./../../src/Observable";

const ob = new Observable({
    cat: 5,
});

ob.watch((...args) => console.log(...args))

ob.cat = 15;