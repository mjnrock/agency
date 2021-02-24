import { v4 as uuidv4 } from "uuid";
/**
 * The <Observable> is basically just a watchable <Object>
 *      and should basically always be used with an <Observer>
 * .next will provide direct access to updates, while an <Observer> will emit
 *      each prop change as an eponymously named event, as well as a "next" event
 *      as a catch-all
 */
//? Only watch events at the root <Observable>, to avoid losing <Observer> bindings
//?     All updates will get bubbled into a .next(dot-notation-prop, value) invocation
export class Observable {
    constructor(deep = true, { noWrap = false } = {}) {
        if(noWrap) {
            return this;
        }

        this.__id = uuidv4();
        
        return new Proxy(this, {
            get(target, prop) {
                return target[ prop ];
            },
            set(target, prop, value) {
                if(deep && (typeof value === "object" || value instanceof Observable)) {
                    target[ prop ] = Factory((...args) => {
                        const props = [ prop, ...args.slice(0, args.length - 1) ].join(".");

                        target.next(props, args.pop());
                    }, value, deep);
                } else {
                    target[ prop ] = value;
                }

                target.next(prop, target[ prop ]);

                return target;
            }
        });
    }

    get next() {
        if(typeof this.__next === "function") {
            return this.__next;
        }

        return () => {};
    }
    set next(fn) {
        if(typeof fn === "function") {
            this.__next = (...args) => new Promise((resolve, reject) => {
                resolve(fn(...args));
            });
        }

        return this;
    }

    toData() {
        const obj = {};
    
        for(let [ key, value ] of Object.entries(this)) {
            if(key[ 0 ] !== "_" && key[ 1 ] !== "_") {
                if(value instanceof Observable) {
                    obj[ key ] = value.toData();
                } else {
                    obj[ key ] = value;
                }
            }
        }
    
        return obj;
    };
};

//? Use the .Factory method to create a <Observable> with default state
export function Factory(state = {}, isDeep = true) {
    const obs = new Observable(isDeep);
    
    if(state instanceof Observable) {
        state = state.toData();
    }

    if(typeof state === "object") {
        for(let [ key, value ] of Object.entries(state)) {
            obs[ key ] = value;
        }
    }

    return obs;
};

Observable.Factory = Factory;

export default Observable;