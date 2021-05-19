import Network from "./../../src/event/Network";
import Dispatcher from "./../../src/event/Dispatcher";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Network({}, {
	default: {
		"*": (msg) => console.log(msg),
	}
});

const disp = new Dispatcher(network, { cat: "Buddhiszka" });

disp.middleware = (n, s, args) => {
	return [ "cat", 2, 3, 4, 5, 6 ];
};

disp.dispatch("cat", 1, 2, 3, 4, 5);