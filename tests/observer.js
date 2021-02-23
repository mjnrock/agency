import Observable from "../src/v2/Observable";
import Observer from "../src/v2/Observer";

let ob = Observable.Create({
    fish: 5,
    cats: {
        qty: 2,
        names: {
            cat1: "Kiszka",
            cat2: "Buddha",
        }
    }
});

const obs = new Observer(ob);
obs.on("next", console.log);

ob = Observable.Create(ob);

ob.cats.qty = 14;