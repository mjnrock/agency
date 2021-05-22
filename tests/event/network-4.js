import Agency from "../../src/index";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Agency.Event.Network({
    cat: 2,
	cats: [
		1, 2, 3, 4,
	]
}, {
    default: {
        // "*": (...args) => console.log(...args),
        test: (msg) => console.log(11111, msg),
    }
});

for(let v of network) {
	console.log(v)
}

network.state.$set = {
	dogs: 5234
}
console.log(network.state);