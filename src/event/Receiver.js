import AgencyBase from "../AgencyBase";

export class Receiver extends AgencyBase {
    constructor(callback, filter) {
        super();

        this.__callback = callback;
        this.__filter = filter;
    }

    receive(message) {
        if(typeof this.__filter === "function") {
            if(this.__filter(message) === true) {
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
};

export default Receiver;