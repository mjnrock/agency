import Observable from "../../src/v2/Observable";
import Value from "./Value";

// const ob = Observable.Create(console.log);
// ob.fish = 5;
// ob.cats = {
//     qty: 2,
//     names: {
//         cat1: "Kiszka",
//         cat2: "Buddha",
//     }
// };

const ob = Observable.Factory({
    fish: 5,
    cats: {
        qty: 2,
        names: {
            cat1: "Kiszka",
            cat2: "Buddha",
        }
    }
});

console.log("=====================");
ob.next = (prop, value) => console.log(`DIFFERENT`, prop.split("."), value);

ob.cats.qty = {
    many: "yes"
};

console.log(ob)
console.log(ob.toData())