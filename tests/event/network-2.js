import Network from "../../src/event/Network";

console.warn(`------------ NEW EXECUTION CONTEXT ------------`);

const network = new Network({
    cat: 2,
});

const channelName1 = "Cats";
network.__bus.createChannel(channelName1);
network.__bus.router.createRoute(message => {
    let list = [
        "meow",
    ];

    if(list.includes(message.type)) {
        return channelName1;
    }
});
network.__bus.channels[ channelName1 ].globals.broadcast = network.broadcast.bind(network);
network.__bus.channels[ channelName1 ].addHandler("meow", function([], { broadcast }) {
    broadcast(this);
});

const e1 = {
    name: `Kiszka`,
};
const e2 = {
    name: `Buddha`,
};

const { dispatch: e1Dis } = network.join(e1, {
    callback(message) {
        if(message.emitter.name === e1.name) {
            return;
        }
        
        console.log("[Kiszka Received]:", message);
    },
});
const { dispatch: e2Dis } = network.join(e2, {
    callback(message) {
        if(message.emitter.name === e2.name) {
            return;
        }
        
        console.log("[Buddha Received]:", message);
    },
});

network.state = {
    ...network.state,
    cats: 1545,
};

e1Dis(`meow`, `This is ${ e1.name }`);
e2Dis(`meow`, `This is ${ e2.name }`);