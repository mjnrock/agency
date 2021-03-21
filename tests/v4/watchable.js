import Watchable from "../../src/v4/Watchable";

const ob = new Watchable({
    cat: 5,
    fish: {
        a: 2,
        blah: {
            cheese: 2,
        }
    },
    hat: [ 1, 2, 3, {cat: 1}],
    _fish: 4512,
});
ob.$.subscribe((...args) => { console.log(this, ...args); });
// ob.$.subscribe(function(...args) { console.log(this, ...args); });

// ob.next = (...args) => console.log(this, ...args); 

// ob.$.subscribe(function(...args) { console.log(this, ...args) })

// ob.cat = 15;
// ob.fish.a = 7;
// ob.fish.blah.cheese = 9;
// ob.fish.blah = { cheese: 999 };
// ob.fish.blah.cheese = 9;
// ob.hat.push(328495)

// ob.test.inside = false;
// ob.test.nested.layer1.layer2.sup = "YES";
ob.test = new Watchable({
    inside: true,
    nested: {
        layer1: {
            layer2: {
                sup: 0
            }
        }
    }
});
ob.test.nested.layer1 = [ 1, 2, 3 ];
ob.test.nested.layer1.push(6)

console.log(999991, ob[ "$.test.nested.layer1" ]);
console.log(999992, ob[ "test.nested.layer1" ]);
console.log(999993, ob[ "nested.layer1" ]);

// ob.purge(true)
// console.log(ob.toData({ includePrivateKeys: true }));

// console.log(ob)
// console.log(ob.toData())
console.log(JSON.stringify(ob))