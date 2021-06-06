import Util from "../../src/v4/util/package";


console.log("------------");

let percento = [ 0, 0, ];
for(let i = 0; i < 10000; i++) {
    const result = Util.Dice.percento();

    result >= 0.50 ? ++percento[ 0 ] : ++percento[ 1 ];
}
console.log(percento)    //  ev: approximately [ 5000, 5000 ]


console.log("------------");

let permille = [ 0, 0, ];
for(let i = 0; i < 10000; i++) {
    const result = Util.Dice.permille();

    result >= 0.500 ? ++permille[ 0 ] : ++permille[ 1 ];
}
console.log(permille)    //  ev: approximately [ 5000, 5000 ]


console.log("------------");

let coins = [ 0, 0, ];
for(let i = 0; i < 10000; i++) {
    const coin = Util.Dice.coin();

    coin ? ++coins[ 0 ] : ++coins[ 1 ];
}
console.log(coins)    //  ev: approximately [ 5000, 5000 ]


console.log("------------");

let coins2 = [ 0, 0, ];
for(let i = 0; i < 10000; i++) {
    const coin2 = Util.Dice.coin2();

    coin2 ? ++coins2[ 0 ] : ++coins2[ 1 ];
}
console.log(coins2)    //  ev: approximately [ 5000, 5000 ]

console.log("------------");

let weighted = [ 0, 0, 0, ];
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
        ++weighted[ 0 ];
    } else if(result === "cat2") {
        ++weighted[ 1 ];
    } else if(result === "cat3") {
        ++weighted[ 2 ];
    }
}
console.log(weighted)    //  ev: approximately [ 2000, 6000, 2000 ]

console.log("------------");

let weighted2 = [ 0, 0, 0, ];
for(let i = 0; i < 10000; i++) {
    const result = Util.Dice.weighted2([
        [ 10, "cat11" ],
        [ 30, "cat22" ],
        [ 10, "cat33" ],
    ]);

    if(result === "cat11") {
        ++weighted2[ 0 ];
    } else if(result === "cat22") {
        ++weighted2[ 1 ];
    } else if(result === "cat33") {
        ++weighted2[ 2 ];
    }
}
console.log(weighted2)    //  ev: approximately [ 2000, 6000, 2000 ]