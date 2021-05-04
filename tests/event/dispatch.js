import Network from "../../src/event/Network";
import Dispatcher from "../../src/event/Dispatcher";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = Network.SimpleSetup({
    cat: function(args) {
        console.log(`[Emitter]:`, this.emitter);
        console.log(`[args]:`, ...args);
    },
});
network.router.useRealTimeProcess();

const disp = new Dispatcher(network, { cat: "Buddhiszka" });

console.log(disp)
console.log(`-----`);

// console.log(network);
// console.log(network.router);
// console.log(network.router.default);
// console.log(network.router.default.handlers);

disp.dispatch("cat", 1, 2, 3, 4, 5);
console.log(`---`);
network.emit(disp, "cat", 1, 2, 3, 4, 5);