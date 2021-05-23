import Network from "../../src/event/Network";
import Watchable from "../../src/event/Watchable";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Network({}, {
	default: {
		// "*": msg => console.log(msg.type, msg.data),
		"*": msg => console.log(msg),
	},
});

const watch = new Watchable({
	cat: {
		cats: 4,
	},
	cats: 2,
	catss: 3,
}, {
	network,
	hooks: {
		"*": msg => console.log(msg),
		cat: msg => console.log("CAT", msg),
		"cat.cats": msg => console.log("CAT.CATS", msg),
		dog: msg => console.log("DOG", msg),
	},
});

console.log(watch.id)
console.log(watch)
console.log(watch.isAttached)

console.warn("------------");

watch.cat.cats = 15;
// watch.dog = 31;