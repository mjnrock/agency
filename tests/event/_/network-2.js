import Network from "../../src/event/Network";
import Emitter from "../../src/event/Emitter";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const e1 = new Emitter();
const e2 = new Emitter();

console.log(Network.$)

e1.__deconstructor();
e2.__deconstructor();
console.log(Network.$)