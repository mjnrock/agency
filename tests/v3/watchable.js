import Watchable from "../../src/Watchable";

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
    test: new Watchable({
        inside: true,
        nested: {
            layer1: {
                layer2: {
                    sup: 0
                }
            }
        }
    })
});
ob.watch((...args) => console.log(this, ...args))

// ob.next = (...args) => console.log(this, ...args); 

// ob.watch(function(...args) { console.log(this, ...args) })

ob.cat = 15;
ob.fish.a = 7;
ob.fish.blah.cheese = 9;
ob.hat.push(328495)

ob.test.inside = false;
ob.test.nested.layer1.layer2.sup = "YES";
ob.test.nested.layer1 = 25223;

// ob.purge(true)
// console.log(ob.toData({ includePrivateKeys: true }));

// console.log(ob)
console.log(ob.toData())
// console.log(JSON.stringify(ob))