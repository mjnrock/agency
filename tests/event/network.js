import Network from "./../../src/event/Network";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Network({
    cat: 2,
});

const { dispatch, receiver } = network.addConnection();
receiver.reassign((...args) => console.log(...args));

console.log(network);
console.log(dispatch);
console.log(receiver);

network.state = {
    ...network.state,
    cats: 1545,
};

console.log(network);
console.log(network.state);