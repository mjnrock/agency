import Console from "../../src/util/Console";

import Node from "../../src/node/Node";

Console.NewContext();

const n1 = new Node({
	state: {
		cat: 2,
		test: true,
	},
	reducers: [
		(data, state) => {
			state.dog = data.value;

			return state;
		},
		(data, state) => {
			state.dog += data.value;

			return state;
		},
	],
	listeners: [
		state => Console.log(`[Connection 1]:`, state),
	],
});
const n2 = new Node({
	state: {
		dog: 3,
	},

	// Trap on incoming @data
	middleware: data => typeof data === "object" ? data : { $value: data },
	config: {
		// Run reducers asynchronously (e.g. API data)
		asAsync: true,
		// Allow sending data to named/numbered "ports" << .receive(data) --> .receive(port, data) >>
		asNamed: {		// Create standard index-based aliases (i.e. `0`, `1`, etc.)
			mutator: state => [ "@port", state ],

			"port-0": 0,
			"p0": 0,

			"group-a": [ 0, 2, 3 ],
			"group-b": [ 1, 3 ],

			fn1: () => 2,
			fn2: () => [ 2, 3, 4 ],
		}
	},

	reducers: [
		(data, state, sender) => {
			if(data.test) {
				state.cat = sender;
			}
			
			return state;
		},
	],
	listeners: [
		(state, sender) => {
			Console.log(`[Connection 2]:`, state, sender.id);
		},
	],
});

n1.link(n2);
n1.receive({ value: 13, test: true });
// n2.receive(13);
// n2.receive(14);

console.log(n1.id)
console.log(n2.id)