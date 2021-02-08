import EventEmitter from "events";

export default class Node extends EventEmitter {
    constructor(reducer, { state = {} } = {}) {
        this.state = state;
        this.reducer = reducer;
    }
};