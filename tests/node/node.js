import Console from "../../src/util/Console";

import Node from "../../src/node/Node";

Console.NewContext();

const n1 = new Node({
	state: {
		cat: 2,
	},
	reducers: [
		(data, state) => {
			state.dog = data;

			return state;
		},
		(data, state) => {
			state.dog += data;

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
	reducers: [
		(data, state) => {
			state.cat = data;

			return state;
		},
	],
	listeners: [
		state => Console.log(`[Connection 2]:`, state),
	],
});

n1.link(n2);
n1.receive(13);
// n2.receive(13);
// n2.receive(14);