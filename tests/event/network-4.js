import Agency from "../../src/index";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Agency.Event.Network({
    cat: 2,
	cats: [
		1, 2, 3, 4,
	]
}, {
    default: {
		$globals: {
			cat: 213124124124,
		},
        // "*": (...args) => console.log(...args),
        test: (msg) => console.log(11111, msg),
		$effects: {
			test: (msg, { cat }) => console.log("--- EFFECT ---", cat),
		},
    }
});

for(let v of network) {
	console.log(v)
}

network.state.$set = {
	dogs: 5234
}
console.log(network.state);

network.message("test", 123451234)
console.log(network.ch`default`.globals);