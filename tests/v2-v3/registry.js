import Registry from "./../../src/v2/Registry";
import Observer from "./../../src/v2/Observer";
import Observable from "../../src/v2/Observable";

class Entity extends Observable {
    constructor() {
        super(false);

        this.test = "cats!";
        this.custom = () => true;
    }    
}

const registry = new Registry();
// registry.cats = 155;
// console.log(registry.toData());     // should NOT have .cats in the result

// const obs = new Observer(registry);
// obs.on("next", (p, v, o, os) => console.log(`OBS`, p, v, o.__id, os.__id));

// const player = new Entity();
// const e2 = new Entity();
// registry.register(player, "player");
// registry.register(e2, "enemy");
// console.log(`REGISTER`, registry.toData())
// registry.unregister(player);
// console.log(`UNREGISTER`, registry.toData()) //  @player, "player" should be gone

// player.test = 235235;

// console.log(`UUID:player`, registry[ player.__id ].__id);
// console.log(`UUID:registry`, registry.__id);
// console.log(`UUID:observer`, obs.__id);
// console.log(registry.toData())
// // console.log(`UUID`, registry[ player.__id ].__id);
// // console.log(`SYN`, registry[ "player" ].__id);
// console.log(`SYN-2`, registry.player.__id);