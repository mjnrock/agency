import Network from "../../src/event/Network";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Network({
    cat: 2,
}, {
    default: {
        // "*": (...args) => console.log(...args),
        test: (msg) => console.log(msg),
    }
});

console.log(network);

network.state = {
    cat: 5,
}

network.emit("test", 1, 2, 3);