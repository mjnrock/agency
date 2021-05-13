class Value {
    constructor(current) {
        this.current = current;
        this.now = Date.now();
    }

    cat() {
        this.current = 18947984156;

        return this;
    }
}

const obj = {
    cats: 154,
    value: new Value(5),
};
const ob = Wrap(obj);

const obs = new Observer(ob);
obs.on("next", (...args) => console.log(`OBS`, ...args));

// ob.value.current = 15;
// obj.value.cat();
// console.log(ob.value.cat())
//FIXME At this point, it's just copying <Value>, as the internal method does not activate the proxy trap