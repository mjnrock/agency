import Observer from "../../src/v2/Observer";
import Observable from "../../src/v2/Observable";

const ob = Observable.Factory({
    cat: 3,
});

const obs = new Observer(ob);
obs.on("next", (...args) => console.log(`NEXT`, ...args));

const obs2 = new Observer(obs);
obs2.on("next", (...args) => console.log(`NEXT2`, ...args));

const obs3 = new Observer(obs2);
obs3.on("next", (...args) => console.log(`NEXT3`, ...args));

ob.dog = 1;     // Should show 3 entries of the same <Observable>