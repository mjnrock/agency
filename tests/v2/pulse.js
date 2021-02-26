import Pulse from "../../src/v2/Pulse";
import Observer from "../../src/v2/Observer";

const repeater = new Pulse(3);

const obs = new Observer(repeater);
obs.on("next", (...args) => console.log(`OBSERVER`, ...args));