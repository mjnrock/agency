import Proposition from "./../../src/v2/Proposition";
import Observable from "./../../src/v2/Observable";
import Context from "./../../src/v2/Context";
import Observer from "./../../src/v2/Observer";
import Channel from "./../../src/v2/Channel";

const channel = new Channel();
channel.on("next", (prop, key, observable) => console.log(prop, key));

const ob = Context.Factory({
    test: 4,
}, {
    rules: {
        "test": Proposition.OR(
            Proposition.IsBetween(1, 100),
        ),
    }
});

const obs = new Observer(ob);
channel.join(obs);

ob.test = 140;

console.log(ob.test)