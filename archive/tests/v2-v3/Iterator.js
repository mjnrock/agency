import Observable from "./../../src/v2/Observable";

export class Iterator extends Observable {
    constructor() {
        super(false, { noWrap: true });

        this._current = 0;
        this.__index = 0;
            
        return new Proxy(this, {
            get(target, prop) {
                return target[ prop ];
            },
            set(target, prop, value) {
                if(prop === "next") {
                    target[ prop ] = value;

                    return target;
                } else if(prop === "__index" || prop === "index")  {
                    if(target[ value ] !== void 0) {
                        target[ prop ] = value;
                    } else {
                        if((value + 1) < target.size) {
                            target[ prop ] = value + 1;
                        } else {
                            target[ prop ] = 0;
                        }
                    }

                    return target;
                } else if(prop === "_current")  {
                    if(value >= 0 && value <= target.__index) {
                        if(target[ value ] === void 0) {
                            let stop = value;
                            while(target[ value ] === void 0) {
                                value += 1;

                                if(value > target.__index) {
                                    value = 0;
                                } else if(value === stop) {
                                    return target;
                                }
                            }
                        }

                        target[ prop ] = value;
                        target.next("current", target[ prop ], target[ value ]);
                    }

                    return target;
                }

                target[ target.__index ] = value;
                target.__index += 1;

                target.next(prop, target[ prop ]);

                return target;
            },
        });
    }

    get current() {
        return this[ this._current ];
    }
    set current(value) {
        console.log("YUES")
        this._current = value;

        return this;
    }
    
    get index() {
        return this.__index;
    }

    inc(amount = 1) {
        this._current += amount;

        return this;
    }
    dec(amount = 1) {
        this._current -= amount;

        return this;
    }
};

export default Iterator;