import Context from "../../src/event/Context";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const ctx = new Context({
	cat: 2
});

ctx.cats = 14;

console.log(ctx.cat);
console.log(ctx.cats);