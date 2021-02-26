import Pulse from "../../src/v2/Pulse";
import Observer from "../../src/v2/Observer";
import Beacon from "../../src/v2/Beacon";

// const repeater = new Pulse(3);
// const obs = new Observer(repeater);
// obs.on("next", (...args) => console.log(`OBSERVER`, ...args));


const beacon = new Beacon();
const pulse = Pulse.Generate(1);

beacon.attach(pulse);
beacon.on("tick", (value, ob, obs) => console.log(`TICK`, value));