import Emitter from "../../src/event/Emitter";
import Network from "../../src/event/Network";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const emitter = new Emitter();
const network = new Network();

console.log(emitter);
console.log(network);