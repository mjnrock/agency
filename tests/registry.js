import Registry from "../src/Registry";
import Channel from "../src/Channel";

const reg = new Registry();
const channel = new Channel(reg);
channel.subscribe(([ state, ...args ]) => console.log(`CHANNEL`, state));

reg.register({ color: "black" }, "Buddha");
reg.register({ color: "calico" }, "Kiszka");

console.log(reg.getBySynonym("Buddha"));
console.log(reg.getBySynonym("Kiszka"));