import Nexus from "../core/Nexus";
import WebSocketClient from "../components/WebSocketClient";
import Console from "../util/Console";
import Signal from "../core/Signal";

Console.NewContext();

const node = Nexus.Spawn({
	state: {
		cat: 2,
	},
	tags: [
		"gatto",
	],
	components: [
		WebSocketClient,
	],
});