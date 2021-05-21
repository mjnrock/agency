import { v4 as uuidv4 } from "uuid";

import Message from "../../src/event/Message";
import MessageCollection from "../../src/event/MessageCollection";
import Network from "../../src/event/Network";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Network({}, {
	default: {
		test: (msg) => {
			console.log(`[Test]`, msg.emitter, msg.type, msg.data);
		},
	},
});

const collection = new MessageCollection([], {});
for(let i = 0; i < 10; i++) {
	collection.add(Message.Generate({
		id: uuidv4(),
	}, "test", i));
}

collection.inject(network);

// console.log(collection);