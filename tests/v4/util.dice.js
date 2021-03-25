import Util from "../../src/v4/util/package";

let results = [ 0, 0, 0, ];
for(let i = 0; i < 10000; i++) {
    const result = Util.Dice.weighted([
        5,
        15,
        5,
    ], [
        "cat1",
        "cat2",
        "cat3",
    ]);

    if(result === "cat1") {
        ++results[ 0 ];
    } else if(result === "cat2") {
        ++results[ 1 ];
    } else if(result === "cat3") {
        ++results[ 2 ];
    }
}
console.log(results)    //  ev: approximately [ 2000, 6000, 2000 ]

console.log("------------");

let results2 = [ 0, 0, 0, ];
for(let i = 0; i < 10000; i++) {
    const result = Util.Dice.weighted2([
        [ 10, "cat11" ],
        [ 30, "cat22" ],
        [ 10, "cat33" ],
    ]);

    if(result === "cat11") {
        ++results2[ 0 ];
    } else if(result === "cat22") {
        ++results2[ 1 ];
    } else if(result === "cat33") {
        ++results2[ 2 ];
    }
}
console.log(results2)    //  ev: approximately [ 2000, 6000, 2000 ]