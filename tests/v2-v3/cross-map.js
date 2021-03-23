import CrossMap from "../../src/v2/util/CrossMap";

const cm = new CrossMap([
    [ 0, 90, 180, 270 ],
    [ "IDLE", "MOVING", "ATTACKING" ],
    [ "NORMAL", "BURNED", "COLD", ],
], { seedFn: (d0, d1, d2) => {
    console.log(d0, d1, d2);

    return Math.random();
} });

const obj = {
    a: 90,
    b: "IDLE",
    c: "COLD",
};
cm.addLookup((obj) => obj.a);
cm.addLookup((obj) => obj.b);
cm.addLookup((obj) => obj.c);


// console.log(cm.__entries.entries());
console.log(cm.get(90, "IDLE", "COLD", false));
cm.set(999, obj);
console.log(cm.get(obj));
console.log(cm.toLeaf());
console.log(JSON.stringify(cm.toLeaf(true)));