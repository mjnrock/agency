//? Only watch events at the root <Observable>, to avoid losing <Observer> bindings
//?     All updates will get bubbled into a .next(dot-notation-prop, value) invocation
export class Observable {
    constructor(next, { deep = true } = {}) {
        if(typeof next === "function") {
            this.next = (...args) => new Promise((resolve, reject) => {
                resolve(next(...args));
            });
        }

        return new Proxy(this, {
            get(target, prop) {
                return target[ prop ];
            },
            set(target, prop, value) {
                if(deep && (typeof value === "object" || value instanceof Observable)) {
                    target[ prop ] = Create((...args) => {
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
};

export function ToData(observable, excluded = [ "__next" ]) {
    const obj = {};

    for(let [ key, value ] of Object.entries(observable)) {
        if(!excluded.includes(key)) {
            if(value instanceof Observable) {
                obj[ key ] = ToData(value);
            } else {
                obj[ key ] = value;
            }
        }
    }

    return obj;
};

export function Create(next, state = {}, isDeep = true) {    
    if(arguments.length === 1 && typeof next === "object" || next instanceof Observable) {
        state = ToData(next);
    }

    const obs = new Observable(next, {
        deep: isDeep,
    });
    
    if(state instanceof Observable) {
        state = ToData(state);
    }

    if(typeof state === "object") {
        for(let [ key, value ] of Object.entries(state)) {
            obs[ key ] = value;
        }
    }

    return obs;
};

Observable.ToData = ToData;
Observable.Create = Create;

export default Observable;