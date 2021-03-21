import EventEmitter from "events";
import EventObservable from "../../src/v2/EventObservable";
import Observable from "../../src/v2/Observable";
import Observer from "../../src/v2/Observer";


const ob = Observable.Factory({
    cat: 2,
    nested: {
        test: 1,
    }
});
const obs = new Observer(ob);
// obs.on("next", (p, v, ob, obs) => console.log(`OBS`, p, v));


const eobs = EventObservable.SubjectFactory(obs, [
    "cat",
    "nested.test",
]);
eobs.on("next", (p, v, ob, obs) => console.log(`EOBS`, p, v));


ob.nested.test += 1;
// ob.cat += 1;

// console.log(`ob.nested.test`, ob.nested.test)