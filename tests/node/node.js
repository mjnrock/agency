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
		(state, nid) => Console.log(`[Connection]:`, state, nid),
	],
});

n1.receive(13);