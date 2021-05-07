import Network from "../../src/event/Network";
import Receiver from "../../src/event/Receiver";

console.warn(`------------ NEW EXECUTION CONTEXT ------------`);

const network = new Network({
    cat: 2,
});

const channelName1 = "Cats";
//? This is an explicit way to do the same thing as << network.alter >> below
    // network.__bus.createChannel(channelName1);
    // network.__bus.router.createRoute(message => {
    //     let list = [
    //         "meow",
    //     ];

    //     if(list.includes(message.type)) {
    //         return channelName1;
    //     }
    // });
    // network.__bus.channels[ channelName1 ].globals.broadcast = network.broadcast.bind(network);
    // network.__bus.channels[ channelName1 ].addHandler("meow", function([], { broadcast }) {
    //     broadcast(this);
    // });
network.alter({
    //? All keys that are *NOT* prefixed with "$" will be used as the @channelName
    [ channelName1 ]: {
        handlers: {
            meow([], { broadcast }) {
                broadcast(this);
            },
        },
        globals: {
            broadcast: network.broadcast.bind(network),
        },
    },

    //? Add routes to the network
    $routes: [
        message => {
            let list = [
                "meow",
            ];
        
            if(list.includes(message.type)) {
                return channelName1;
            }
        },
    ],    
    
    //? Alternative modifier to attach precreated channels directly--elements must be a <Channel>
    // $channels: [ @channel1<Channel>, @channel2<Channel> ],

    //? Command verb to delete anything within its scope
    // $delete: {
    //     routes: [ () => {} ],
    //     channels: [ "bob" ],
    // }
});

const e1 = {
    name: `Kiszka`,
};
const e2 = {
    name: `Buddha`,
};

//? @receiver is returned to allow for network-aware changes: 1) Modifying the @callback fn, 2) Add/removing a @filter fn
const { dispatch: e1d, receiver: e1r } = network.join(e1, {
    callback(message) {        
        console.log("[Kiszka Received]:", message);
    },
});
const { dispatch: e2d, receiver: e2r } = network.join(e2, {
    callback(message) {        
        console.log("[Buddha Received]:", message);
    },
});

network.state = {
    ...network.state,
    cats: 1545,
};

e1r({
    filter: Receiver.Typed("meow", false),
});
e2r({
    filter(msg) {
        return msg.emitter.name !== e2.name;
    }
});

e1d(`meow`, `This is ${ e1.name }`);
e2d(`meow`, `This is ${ e2.name }`);