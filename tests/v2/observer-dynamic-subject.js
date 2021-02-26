import Observer from "../../src/v2/Observer";
import Observable from "../../src/v2/Observable";

//! The testing here reveals <Beacon> is viable, as <Observer> subjects require metadata

const ob1 = Observable.Factory({
    cat: 3,
});
const ob2 = Observable.Factory({
    dog: 1,
});

const obs1 = new Observer(ob1);
obs1.on("next", (prop, value, ob, obs) => console.log(`OBS1`, prop, value, ob.__id, obs.__id));

const obs2 = new Observer(ob2);
obs2.on("next", (prop, value, ob, obs) => console.log(`OBS2`, prop, value, ob.__id, obs.__id));



const obsX = new Observer(obs1);
obsX.on("next", (prop, value, ob, obs) => console.log(`OBSX`, prop, value, ob.__id, obs.__id));

console.log("----- ++ob1.cat; -----");
++ob1.cat;

console.log("----- dynamic swap -----");
obsX.subject = obs2;

console.log("----- ++ob1.cat; ++ob2.dog; -----");
++ob1.cat;
++ob2.dog;