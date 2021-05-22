import Network from "../../src/event/Network";
import Watchable, { Factory, AsyncFactory } from "../../src/event/Watchable";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Network({}, {
    default: {
        "**": msg => console.log(msg),
        // [ Watchable.ControlType.READ ]: msg => console.log(msg),
    },
});

const watch = new Watchable(network, {
	cat: 1,
	cats: 2,
	catss: 3,
});

console.log(watch)

watch.$set = {
	cat: 3,
	cats: 2,
	catss: 1,
};

console.log(watch)