import Iterator from "./Iterator";
import Observer from "./../../src/v2/Observer";

const iter = new Iterator();

const obs = new Observer(iter);
// obs.on("next", (prop, value, ob, obs) => console.log(`OBS`, prop, value));

iter[4] = "cat1";
iter[4] = "cat2";
iter[4] = "cat3";
iter[4] = "cat4";
iter[4] = "cat5";
iter[4] = "cat6";

delete iter[2];
delete iter[3];

console.log(iter.toData())
console.log(iter._current, iter.current)
iter.inc()
console.log(iter._current, iter.current)
iter.inc()
console.log(iter._current, iter.current)
iter.inc(5)
console.log(iter._current, iter.current)