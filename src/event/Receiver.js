import { v4 as uuidv4 } from "uuid";

export class Receiver {
    constructor(callback, filter) {

        this.callback = callback;
        this.filter = filter;
    }

    receive(message) {
        console.log(999999)
        console.log(999999)
        console.log(999999)
        console.log(999999)
        console.log(this.filter)
        console.log(999999)
        console.log(999999)
        if(typeof this.filter === "function") {
            if(this.filter(message) === true) {
                return;
            }
        }
        
        if(typeof this.callback === "function") {
            return this.callback(message);
        }
    }

    reassign(callback) {
        if(typeof callback === "function") {
            this.callback = callback;
        }
    }

    refilter(fn) {
        if(typeof fn === "function") {
            this.filter === fn;
        }
    }
};

export default Receiver;