import Context from "./../src/Context";
import Channel from "./../src/Channel";

const channel = new Channel();
const ctx = new Context({
    cats: 2,
}, (state) => {
    return {
        ...state,
        cats: state.cats + 1,
    };
});

channel.add(ctx);
channel.watch("fish", ctx);

channel.subscribe((ctx, type, ...args) => console.log(`CHANNEL`, type, ...args));

ctx.emit("fish", 2345);

ctx.run();