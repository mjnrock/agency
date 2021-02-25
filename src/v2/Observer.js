import { v4 as uuidv4 } from "uuid";
import EventEmitter from "events";
import Observable from "./Observable";

export class Observer extends EventEmitter {
    constructor(observable) {
        super();

        if(!(observable instanceof Observable)) {
            throw new Error("@observable must be an <Observable>");
        }

        this.__id = uuidv4();
        this.subject = observable;
    }

    get subject() {
        return this.__subject;
    }
    set subject(observable) {
        if(observable instanceof Observable) {            
            this.__subject = observable;
            this.__subject.next = (props, value) => {
                this.emit(props, value);
                this.emit("next", props, value);
            };
        }

        return this;
    }
};

//  Create an <Observer> from an EXISTING <Observable>
export function Create(observable) {
    return new Observer(observable);
};

//  Create an <Observer> from an NON-EXISTING <Observable> via Observable.Create(...args)
export function Generate(state = {}, isDeep = true) {
    return new Observer(Observable.Factory(state, isDeep));
};

Observer.Create = Create;
Observer.Generate = Generate;

export default Observer;