import Agency from "./../../src/index";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const network = new Agency.Event.Network({
    cat: 2,
}, {
    default: {
        // "*": (...args) => console.log(...args),
        test: (msg) => console.log(11111, msg),
    }
});
const n2 = new Agency.Event.Network({}, {
    default: {
        // "*": (...args) => console.log(...args),
        test: (msg) => console.log(22222, msg),
    }
});

console.log(network);

network.state = {
    cat: 5,
}

network.addListener(n2);
network.message("test", 1, 2, 3);


// network.addListener(n2);

// console.log(network.__connections)
// console.log(network.getController(n2))

network.broadcast("test", 5, 6, 7)