import { v4 as uuidv4 } from "uuid";

import Message from "../../src/event/Message";
import MessageCollection from "../../src/event/MessageCollection";
import Network from "../../src/event/Network";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Network({
	setHistory: [],
	mergeHistory: [],
}, {
	default: {
		$reducers: {
			test: (msg, { state }) => {
				console.log(`[Reducer::${ msg.type }]`, msg.emitter, msg.data);

				return {
					setHistory: [ ...state.setHistory, msg.data ],
					mergeHistory: state.mergeHistory,
				};
			},
		},
		$mergeReducers: {
			test: (msg, { state }) => {
				console.log(`[MergeReducer::${ msg.type }]`, msg.emitter, msg.data);

				return {
					mergeHistory: [ ...state.mergeHistory, Math.random() ],
				};
			},
		},
		$effects: {
			test: (msg, { state }) => {
				console.log(`[Effect::${ msg.type }]`, msg.isFrom(network));
				console.log(" ");
			},
		},
		test: (msg, { getState }) => {
			console.log(`[Handler::${ msg.type }]`, msg.emitter, msg.type, msg.data);

			return {
				setHistory: [ ...getState().setHistory, msg.data ],
			};
		},
	},
});

const collection = new MessageCollection([], {
	// capacity: 2,
});
for(let i = 0; i < 10; i++) {
	collection.add(Message.Generate(network, "test", i));
}

collection.inject(network);

console.log(collection.getHash("sha256"));
console.log(network.state);