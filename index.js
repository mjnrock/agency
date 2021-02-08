import Context from "./Context";

const ctx = new Context({
    state: 2,
    participants: [
        "Matt",
    ]
});

console.log(ctx);

ctx.add("Cat");
ctx.add("Matt");
console.log(ctx);

let a = new Set([
    1, 2, 3
])
a = new Set([
    ...a,
    5
])

console.log(a)