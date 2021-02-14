import Registry from "../src/Registry";
import Channel from "../src/Channel";

const reg = new Registry();
const channel = new Channel(reg);
channel.subscribe(([ state ]) => console.log(`CHANNEL`, state));

const obj = { cat: 5 };
const eid = reg.register(obj);

console.log(eid);