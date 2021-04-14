import Emitter from "../../src/event/Emitter";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const emitter = new Emitter();
emitter.cats = 54354;

console.log(emitter)