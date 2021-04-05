export const $EventReceiver = $super => class extends $super {
    constructor({ EventReceiver = {}, ...rest } = {}) {
        super({ ...rest });

        this.__filter = typeof EventReceiver.filter === "function" ? EventReceiver.filter : (() => true);     // Universal filter that executed immediately in .handle to determine if should proceed
        this.__handlers = {
            "*": new Set(),
        };

        for(let [ event, fns ] of Object.entries(EventReceiver.handlers || [])) {
            this.addHandler(event, fns);
        }
    }

    get $() {
        const _this = () => this;

        return {
            ...(super.$ || {}),

            /**
             * This is an internal function, so you must bind a proper payload before using outside of its
             *      normal, singular scope within the emit function.  It is only here to exploit "this" bindings.
             */
            _handle(...args) {
                const payload = this;

                if(payload.provenance.has(_this()) === false) {
                    if(typeof _this().__filter === "function" && _this().__filter.call(payload, ...args) === true) {
                        const receivers = _this().__handlers[ "*" ] || [];
                        for(let receiver of receivers) {
                            if(typeof receiver === "function") {
                                receiver.call(payload, ...args);
                            }
                        }
                        
                        const handlers = _this().__handlers[ this.type ] || [];
                        for(let handler of handlers) {
                            if(typeof handler === "function") {
                                handler.call(payload, ...args);
                            }
                        }
                        
                        if(typeof _this().__relay === "function" && _this().__relay.call(payload, ...args) === true) {
                            _this().$.emit.call(payload, this.type, ...args);
                        }
                    }

                    return true;
                }

                return false;
            },
            async _asyncHandler(...args) {
                const payload = this;

                if(payload.provenance.has(_this()) === false) {
                    if(typeof _this().__filter === "function" && _this().__filter.call(payload, ...args) === true) {
                        const receivers = _this().__handlers[ "*" ] || [];
                        for(let receiver of receivers) {
                            if(typeof receiver === "function") {
                                receiver.call(payload, ...args);
                            }
                        }
                        
                        const handlers = _this().__handlers[ this.type ] || [];
                        for(let handler of handlers) {
                            if(typeof handler === "function") {
                                handler.call(payload, ...args);
                            }
                        }
                        
                        if(typeof _this().__relay === "function" && _this().__relay.call(payload, ...args) === true) {
                            _this().$.asyncEmit.call(payload, this.type, ...args);
                        }
                    }

                    return true;
                }

                return false;
            },
        }
    }

    get handlers() {
        return Object.entries(this.__handlers);
    }

    addHandler(event, ...fns) {
        if(!(this.__handlers[ event ] instanceof Set)) {
            this.__handlers[ event ] = new Set();
        }

        if(Array.isArray(fns[ 0 ])) {
            fns = fns[ 0 ];
        }

        for(let fn of fns) {
            if(typeof fn === "function") {
                this.__handlers[ event ].add(fn);
            }
        }

        return this;
    }
    addHandlers(addHandlerArgs = []) {
        for(let [ event, ...fns ] of addHandlerArgs) {
            this.addHandler(event, ...fns);
        }

        return this;
    }
    removeHandler(event, ...fns) {
        if(this.__handlers[ event ] instanceof Set) {
            if(Array.isArray(fns[ 0 ])) {
                fns = fns[ 0 ];
            }
            
            let bools = [];
            for(let fn of fns) {
                bools.push(this.__handlers[ event ].delete(fn));
            }

            if(bools.length === 1) {
                return bools[ 0 ];
            }

            return bools;
        }

        return false;
    }
    removeHandlers(addHandlerArgs = []) {
        for(let [ event, ...fns ] of addHandlerArgs) {
            this.removeHandler(event, ...fns);
        }

        return this;
    }
};

export default $EventReceiver;