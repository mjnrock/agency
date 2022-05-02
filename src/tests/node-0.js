import Node from "../swarm/Node";
import Console from "./../util/Console";

Console.NewContext();

const node = new Node();
const node2 = new Node();
// console.log(node);

// node.addTrigger("test", ([ a, b, c ], { trigger, node }) => {
// 	console.log(a, b, c);
// });

// node.invoke("test", 1, 2, 3);

// const cats = {
// 	meows: "yes",
// };
// node.addTrigger(cats, ([ a, b ], { trigger, node }) => {
// 	console.log(a, b);
// });

// node.invoke(cats, "meew", "cheese");

node.tags = [[ "cat" ]];
console.log(node.tags);
console.log(node2.tags);





// node.addTrigger("test", (...args) => {
// 	console.log(args);
// });
// node.addTrigger(node.config.namespace("test"), (...args) => {
// 	console.log(args);
// });

// node.invoke("test", 1, 2, 3);
// node.invoke(Signal.Create({
// 	type: "test",
// 	data: 9,
// 	emitter: node,
// }));

// node.invoke("update", {
// 	cats: 2,
// });
// console.log(node.state);
// node.invoke(node.config.namespace("state"), {
// 	cats: 4,
// });
// console.log(node.state);