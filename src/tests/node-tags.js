import Nexus from "../core/Nexus";
import Console from "../util/Console";

Console.NewContext();

const node = Nexus.Spawn({
	state: {
		cat: 2,
	},
	tags: [
		"gatto",
	],
});

console.log(node.tags)
console.log(Nexus.$match([
	"gatto"
], {
	map: node => node.id
}))