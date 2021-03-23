import Observable from "../../src/v2/Observable";
import Observer from "../../src/v2/Observer";

const ob = Observable.Factory({
    arr: [ 1 ],
}, false);


const obs = new Observer(ob);
obs.on("next", (...args) => console.log(`OBS`, ...args));

ob.arr.push(5);
// ob.arr = [
//     ...ob.arr,
//     6,
// ]
// console.log(ob);