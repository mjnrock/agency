import { v4 as uuidv4 } from "uuid";
import EventEmitter from "events";
import Observable from "./Observable";

/**
 * <Observer> will bubble up the original <Observable> and
 *      the first <Observer> to observe the change, no matter
 *      how many nested-levels deep the observation took place.
 */
export class Observer extends EventEmitter {
    constructor(observable) {
        super();

        if(!(observable instanceof Observable || observable instanceof Observer)) {
            throw new Error("@observable must be an <Observable>");
        }

        this.__id = uuidv4();
        this.subject = observable;
    }

    get subject() {
        if(this.__subject instanceof Observer) {
            return this.__subject.subject;
        }

        return this.__subject;
    }
    set subject(observable) {
        if(observable instanceof Observable) {
            this.__subject = observable;
            this.__subject.next = (props, value) => {
                this.emit(props, value, observable, this);
                this.emit("next", props, value, observable, this);
            };
        } else if(observable instanceof Observer) {
            this.__subject = observable;
            this.__subject.on("next", (props, value, subject, observer) => {
                this.emit("next", props, value, subject, observer);
            });
        }

        return this;
    }
};

//  Create an <Observer> from an EXISTING <Observable>
export function Factory(observable) {
    return new Observer(observable);
};

//  Create an <Observer> from an NON-EXISTING <Observable> via Observable.Create(...args)
export function Generate(state = {}, isDeep = true) {
    return new Observer(Observable.Factory(state, isDeep));
};

Observer.Factory = Factory;
Observer.Generate = Generate;

export default Observer;