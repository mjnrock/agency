import Watchable from "../../src/v4/Watchable";
import Watcher from "../../src/v4/Watcher";

const ob1 = new Watchable({
    cat: 5,
});
const ob2 = new Watchable({
    cat: 9,
});

const obs1 = new Watcher([
    ob1,
    ob2,
]);
// obs1.$.watch(ob1);
// obs1.$.watch(ob2);
const obs2 = new Watcher([
    obs1,
]);
// obs2.$.watch(obs1);
const obs3 = new Watcher([
    obs2,
]);
// obs3.$.watch(obs2);
const obs4 = new Watcher([
    obs3,
]);
// obs4.$.watch(obs3);

// obs.$.subscribe((...args) => { console.log(this, ...args); });
// obs1.$.subscribe(function(...args) { console.log(this, ...args); });
obs4.$.subscribe((...args) => { console.log(this, ...args); });
// obs4.$.subscribe(function(...args) { console.log(this, ...args); });

// ob1.cat = 10;
// ob2.cat = 15;
obs2.test = 489;

// ob1.cat = 10;   // Should Fire
// ob1.cat = 10;   // Should NOT fire because same value
// ob1.cat = 19;   // Should fire


console.log(1, obs1.$.id)
console.log(2, obs2.$.id)
console.log(3, obs3.$.id)
console.log(4, obs4.$.id)