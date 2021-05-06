import Emitter from "../../src/event/Emitter";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const emitter = new Emitter();
emitter.cats = 54354;

console.log(emitter)


emitter.addHandler("*", function(...args) { console.log(this.data, ...args); });
emitter.addHandler("cat", (...args) => console.log(...args));
emitter.invoke("cat", 1, 2, 3, 4, 5, 6);
emitter.$.emit("cat", 1, 2, 3, 4, 5, 6);