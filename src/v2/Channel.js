import EventEmitter from "events";
import Observer from "./Observer";
import Proposition from "./Proposition";

export class Channel extends EventEmitter {
    constructor() {
        super();

        this.members = new Map();
    }

    join(observer, proposition) {
        let fn;
        if (proposition instanceof Proposition) {
            fn = (props, value) => {
                if (proposition.test(props, value, observer)) {
                    this.emit(props, value, observer);
                    this.emit("next", props, value, observer);
                }
            };
        } else {
            fn = (props, value) => {
                this.emit(props, value, observer);
                this.emit("next", props, value, observer);
            }
        };

        this.members.set(observer.__id, { member: observer, fn });

        observer.on("next", fn);

        return this;
    }
    joinObservable(observable) {
        const obs = new Observer(observable);

        this.join(obs);

        return obs;
    }

    leave(observer) {
        const { fn } = this.members.get(observer.__id);
        observer.off("next", fn);

        this.members.delete(observer.__id);
    }
}

export function PropType(prop) {
    return Proposition.OR(
        (props, value, observer) => {
            return props === prop;
        }
    );
}
export function PropTypes(...props) {
    return Proposition.OR(
        (prop, value, observer) => {
            return props.includes(prop);
        }
    );
}

Channel.PropType = PropType;
Channel.PropTypes = PropTypes;

export default Channel;