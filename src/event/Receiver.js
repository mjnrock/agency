import AgencyBase from "../AgencyBase";

export class Receiver extends AgencyBase {
    constructor(callback, filter) {
        super();

        this.__callback = callback;
        this.__filter = filter;
    }

    receive(message) {
        if(typeof this.__filter === "function") {
            if(this.__filter(message) === false) {
                return;
            }
        }
        
        if(typeof this.__callback === "function") {
            return this.__callback(message);
        }
    }

    reassign(callback) {
        if(typeof callback === "function") {
            this.__callback = callback;
        }
    }

    refilter(fn) {
        if(typeof fn === "function") {
            this.__filter === fn;
        }
    }

    static Typed(types = [], include = true) {
        if(!Array.isArray(types)) {
            types = [ types ];
        }
        
        return function(message) {
            if(include === true) {
                return types.includes(message.type);
            }

            return !types.includes(message.type);
        }
    }
    static Filtered(fn = [], include = true) {
        if(!Array.isArray(fn)) {
            fn = [ fn ];
        }

        return function(message) {
            if(include === true) {
                return fn.every(message);
            }
            
            return !fn.every(message);
        }
    }
};

export default Receiver;