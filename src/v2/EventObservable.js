/* eslint-disable */
import Observable from "./Observable";

export const StandardLibrary = {
    Keyboard: [
        "keyup",
        "keydown",
        "keypress",
    ],
    Mouse: [
        "mouseup",
        "mousedown",
        "mousemove",
        "click",
        "dblclick",
        "contextmenu",
    ],
    // Pointer: [
    //     "pointerover",
    //     "pointerenter",
    //     "pointerdown",
    //     "pointermove",
    //     "pointerup",
    //     "pointercancel",
    //     "pointerout",
    //     "pointerleave",
    //     "gotpointercapture",
    //     "lostpointercapture",
    // ],
};

export default class EventObservable extends Observable {
    constructor(eventEmitter, events = [], { windowDefault = true } = {}) {
        super(false);

        if(windowDefault) {
            eventEmitter = eventEmitter || window;
        }

        this.subject = eventEmitter;

        this.add(...events);
    }

    __updateFn(e) {
        this[ e.type ] = {
            e,
            dt: Date.now(),
            n: ((this[ e.type ] || {}).n || 0) + 1
        };
    }

    add(...eventNames) {
        if(Array.isArray(eventNames[ 0 ])) {    // "Single argument" assumption, overload
            eventNames = eventNames[ 0 ];
        }

        for(let eventName of eventNames) {
            this.subject.on(eventName, this.__updateFn.bind(this));
        }
    }
    remove(...eventNames) {
        if(Array.isArray(eventNames[ 0 ])) {    // "Single argument" assumption, overload
            eventNames = eventNames[ 0 ];
        }

        for(let eventName of eventNames) {
            delete this[ eventName ];

            this.subject.off(eventName, this.__updateFn.bind(this));
        }
    }
}