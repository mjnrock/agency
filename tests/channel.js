import Proposition from "../src/Proposition";
import Context from "../src/Context";
import Channel from "../src/Channel";

const ctx = new Context({
    cats: 2,
}, [
    [
        state => ({
            ...state,
            _now: Date.now(),
        }),
        Proposition.IsType("cat"),
    ]
]);

const channel = new Channel(ctx);

channel.subscribe(([ state ]) => console.log(`CHANNEL`, state));

ctx.run([ "cat" ]);