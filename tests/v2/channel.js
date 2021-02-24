import Proposition from "./../../src/v2/Proposition";
import Context from "./../../src/v2/Context";
import Observer from "./../../src/v2/Observer";
import Channel from "./../../src/v2/Channel";

const channel = new Channel();
channel.on("next", (prop, value, observable) => console.log(prop, value));

const ob = Context.Factory({
    test: 4,
    cat: 2,
}, {
    rules: {
        "test": Proposition.OR(
            Proposition.IsBetween(1, 100),
        ),
    }
});

const obs = new Observer(ob);
// channel.join(obs, Channel.PropType("test"));
// channel.join(obs, Channel.PropTypes("cat"));
// channel.join(obs);
channel.join(obs, Proposition.AND(
    Channel.IsObserver(obs),
    Proposition.NOT(Channel.PropType(/[a-zA-Z0-9]*\.next/i)),
));

// ob.test = 14;
ob.cat = {};
ob.cat.cats = 5;

// console.log(ob.cat.toData());
// console.log(ob.toData());