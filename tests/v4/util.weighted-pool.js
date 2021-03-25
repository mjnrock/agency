import Util from "../../src/v4/util/package";

const wp = new Util.WeightedPool([
    5,
    15,
    5,
], [
    "cat1",
    "cat2",
    "cat3",
]);

console.log(wp.chance(0))   // ev:  0.2
console.log(wp.chance(1))   // ev:  0.6
console.log(wp.chance(2))   // ev:  0.2

console.log(wp.weight(0))   // ev:  5
console.log(wp.weight(1))   // ev:  15
console.log(wp.weight(2))   // ev:  5

console.log(wp.value(0))    // ev: "cat1"
console.log(wp.value(1))    // ev: "cat2"
console.log(wp.value(2))    // ev: "cat3"

console.log("------------");

let results = [ 0, 0, 0, ];
for(let i = 0; i < 10000; i++) {
    const result = wp.roll();

    if(result === wp.value(0)) {
        ++results[ 0 ];
    } else if(result === wp.value(1)) {
        ++results[ 1 ];
    } else if(result === wp.value(2)) {
        ++results[ 2 ];
    }
}
console.log(results)    //  ev: approximately [ 2000, 6000, 2000 ]

console.log("------------");

wp.weight(0, 10)
wp.weight(1, 30)
wp.weight(2, 10)

console.log(wp.chance(0))   // ev:  0.2
console.log(wp.chance(1))   // ev:  0.6
console.log(wp.chance(2))   // ev:  0.2

console.log(wp.weight(0))   // ev:  10
console.log(wp.weight(1))   // ev:  30
console.log(wp.weight(2))   // ev:  10

wp.value(0, "cat11")
wp.value(1, "cat22")
wp.value(2, "cat33")

console.log(wp.value(0))    // ev: "cat11"
console.log(wp.value(1))    // ev: "cat22"
console.log(wp.value(2))    // ev: "cat33"

console.log("------------");

//  weights, values
wp.reweigh([
    5,
    15,
    5,
], [
    "cat1",
    "cat2",
    "cat3",
]);

console.log(wp.chance(0))   // ev:  0.2
console.log(wp.chance(1))   // ev:  0.6
console.log(wp.chance(2))   // ev:  0.2

console.log(wp.weight(0))   // ev:  5
console.log(wp.weight(1))   // ev:  15
console.log(wp.weight(2))   // ev:  5

console.log(wp.value(0))    // ev: "cat1"
console.log(wp.value(1))    // ev: "cat2"
console.log(wp.value(2))    // ev: "cat3"

console.log("------------");

//  weight:value pairs
wp.reweigh([
    [ 10, "cat11" ],
    [ 30, "cat22" ],
    [ 10, "cat33" ],
]);

console.log(wp.chance(0))   // ev:  0.2
console.log(wp.chance(1))   // ev:  0.6
console.log(wp.chance(2))   // ev:  0.2

console.log(wp.weight(0))   // ev:  10
console.log(wp.weight(1))   // ev:  30
console.log(wp.weight(2))   // ev:  10

console.log(wp.value(0))    // ev: "cat11"
console.log(wp.value(1))    // ev: "cat22"
console.log(wp.value(2))    // ev: "cat33"