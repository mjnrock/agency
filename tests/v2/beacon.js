import Proposition from "../../src/v2/Proposition";
import Context from "../../src/v2/Context";
import Observer from "../../src/v2/Observer";
import Beacon from "../../src/v2/Beacon";

const beacon = new Beacon();
beacon.on("next", (prop, value, observable) => console.log(prop, value));

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
beacon.attach(obs, Proposition.AND(
    Beacon.IsObserver(obs),
    Proposition.NOT(Beacon.PropType(/[a-zA-Z0-9]*\.next/i)),
));

// ob.test = 14;
ob.cat = {};
ob.cat.cats = 5;

// console.log(ob.cat.toData());
// console.log(ob.toData());