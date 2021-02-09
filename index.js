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