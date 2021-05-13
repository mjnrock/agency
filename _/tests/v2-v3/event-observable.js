import EventEmitter from "events";
import EventObservable from "../../src/v2/EventObservable";
import Observer from "../../src/v2/Observer";

const eventEmitter = new EventEmitter();

const keySimulator = new EventObservable(eventEmitter, [
    "keyup",
    "keydown",
]);

const obs = new Observer(keySimulator);
obs.on("next", (...args) => console.log(`OBSERVER`, ...args));

eventEmitter.on("keyup", (...args) => {
    console.log(`EVENT:keyup`, ...args);
})
eventEmitter.on("keydown", (...args) => {
    console.log(`EVENT:keydown`, ...args);
})

eventEmitter.emit("keyup", { type: "keyup "});
eventEmitter.emit("keydown", { type: "keydown "});
eventEmitter.emit("keydown", { type: "keydown "});
eventEmitter.emit("keydown", { type: "keydown "});

// console.log(keySimulator)