import EventEmitter from "events";
import Observable from "./Observable";

export class Observer extends EventEmitter {
    constructor(observable) {
        super();

        if(!(observable instanceof Observable)) {
            throw new Error("@observable must be an <Observable>");
        }

        this.subject = observable;
        this.subject.next = (props, value) => {
            this.emit(props, value);
            this.emit("next", props, value);
        };
    }

    get subject() {
        return this.__subject;
    }
    set subject(observable) {
        if(observable instanceof Observable) {
            this.__subject = observable;
        }

        return this;
    }
}

export default Observer;