import Observer from "../../src/v2/Observer";
import Observable from "../../src/v2/Observable";
import Value from "./Value";
import Experience from "./Experience";

// const value = new Value(5, { min: 0, max: 10 });
const value = new Experience(5);
const ob = Observable.Factory({
    value: value,
    cat: {
        fish: new Value(19),
    }
});
// console.log(value)
// console.log(value.toData())

const obs = new Observer(ob);
obs.on("next", (...args) => console.log(`NEXT`, ...args));

ob.value.current = 1500;
ob.value.current = 2000;

console.log(ob.value.total)

ob.cat.fish.current = 1500;
console.log(ob.toData())


// console.log(value)
// console.log(ob)
// console.log(ob.cats)