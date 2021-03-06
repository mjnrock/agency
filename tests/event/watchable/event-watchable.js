import EventEmitter from "events";
import Network from "../../../src/event/Network";
import Watchable from "../../../src/event/watchable/Watchable";
import EventWatchable from "../../../src/event/watchable/EventWatchable";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Network({}, {
    default: {
        "**": msg => console.log(msg),
        [ Watchable.ControlType.UPSERT ]: msg => console.log(msg),
    },
});

const ee = new EventEmitter();
const ew = new EventWatchable(ee, [
    "cat",
], {
	network: network,
	// hooks: {
	// 	"*": msg => console.log(msg.type, msg.data)
	// },
    useControlMessages: true,
    useAsRelayOnly: true,
    namespace: "namespace1.namespace2",
});


ee.emit("cat", 1, 2, 3);
console.log(ew);
ee.emit("cat", 4, 5, 6);
console.log(ew);