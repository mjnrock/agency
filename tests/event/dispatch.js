import Network, { BasicNetwork } from "../../src/event/Network";
import Dispatcher from "../../src/event/Dispatcher";
import Emitter from "../../src/event/Emitter";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = Network.BasicNetwork({
    cat: function(args) {
        console.log(this);
        console.log(...args);
    },
});
network.router.useRealTimeProcess();

const disp = new Dispatcher(network, { cat: "Buddhiszka" });

console.log(disp)

// console.log(network);
// console.log(network.router);
// console.log(network.router.default);
// console.log(network.router.default.handlers);

disp.dispatch("cat", 1, 2, 3, 4, 5);

// network.emit(disp, "cat", 1, 2, 3, 4, 5);