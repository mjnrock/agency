import Proposition from "../../src/v2/Proposition";
import Context from "../../src/v2/Context";
import Observer from "../../src/v2/Observer";
import Beacon from "../../src/v2/Beacon";
import Observable from "../../src/v2/Observable";

console.log(" ==================== BEGIN beacon ========================= ");

const beacon = new Beacon();
beacon.on("next", (...args) => console.log(`BEACON`, ...args));

const ob1 = Observable.Factory({
    name: 1,
});
const obs1 = Observer.Factory(ob1);
obs1.on("next", (...args) => console.log(`OBS1`, ...args));

const obs2 = new Observer(obs1);
obs2.on("next", (...args) => console.log(`OBS2`, ...args));

const obs3 = new Observer(obs2);
obs3.on("next", (...args) => console.log(`OBS3`, ...args));

const obX = Observable.Factory({
    name: 2,
});
const obsX = Observer.Factory(obX);
obsX.on("next", (...args) => console.log(`OBSX`, ...args));

beacon.attach(obs3);
beacon.attach(obsX);

console.log(obs1.__id);
console.log(obs2.__id);
console.log(obs3.__id);
console.log(obsX.__id);

ob1.cat = 3;
obX.cat = 5;




// const beacon = new Beacon();
// beacon.on("next", (prop, value, observable) => console.log(prop, value));

// const ob = Context.Factory({
//     test: 4,
//     cat: 2,
// }, {
//     rules: {
//         "test": Proposition.OR(
//             Proposition.IsBetween(1, 100),
//         ),
//     }
// });

// const obs = new Observer(ob);
// // channel.join(obs, Channel.PropType("test"));
// // channel.join(obs, Channel.PropTypes("cat"));
// // channel.join(obs);
// beacon.attach(obs, Proposition.AND(
//     Beacon.IsObserver(obs),
//     Proposition.NOT(Beacon.PropType(/[a-zA-Z0-9]*\.next/i)),
// ));

// // ob.test = 14;
// ob.cat = {};
// ob.cat.cats = 5;

// // console.log(ob.cat.toData());
// // console.log(ob.toData());


console.log(" ==================== END beacon ========================= ");