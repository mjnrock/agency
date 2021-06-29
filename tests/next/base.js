import { v4 as uuidv4, validate } from "uuid";

import Console from "../../src/util/Console";

import Message from "./../../next/event/Message";
import Channel from "./../../next/event/Channel";

Console.NewContext();

const subject = {
	id: uuidv4(),
};
const data = {
	now: Date.now(),
};
const tags = [
	`cat`,
	// `dog`,
	`fish`,
];

const msg = new Message(subject, data, tags);
console.log(msg);

const $state = {
	cache: {},
};

const channel = new Channel({
	refs: {
		setState: (state) => {
			console.log("STATE SET");

			$state.cache = state;
		},
		getState: () => $state,
	},
	hooks: {
		"*": msg => console.log(`[Pre]:`, $state),
		// cat: msg => console.log("CATTTSSS"),
		dog: msg => console.log("DOGGGSSS"),
		fish: msg => console.log("FISHSSS"),
		$reducers: {
			cat: msg => {
				console.log("CATTTSSS")

				return {
					data: true,
				};
			},
		},
		"**": msg => console.log(`[Post]:`, $state),
	},
});

channel.bus(msg);
console.log(msg);
console.log(msg.hash);
console.log(Message.Conforms(msg));
console.log(Message.ConformsBasic(msg));
console.log(msg.toString());