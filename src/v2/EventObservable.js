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

/**
 * This class wraps an <EventEmitter> and watches
 *      for @events.  Each invocation will store
 *      all arguments present in the event into a
 *      local this[ type ] object, thus triggering
 *      any attached <Observer> to broadcast the data.
 *      
 * The <EventObservable> will cache the previous (n-1)
 *      data so that comparative analysis can be performed.
 */
export class EventObservable extends Observable {
    constructor(eventEmitter, events = [], { windowDefault = false } = {}) {
        super(false);

        if(windowDefault) {
            eventEmitter = eventEmitter || window;
        }

        this.__emitter = eventEmitter;
        this.__handlers = {};

        this.add(...events);
    }

    __updateFn(type, ...args) {
        this[ type ] = {
            previous: {
                data: this[ type ].data,
                dt: this[ type ].dt,
                n: this[ type ].n,
            },
            data: args,
            dt: Date.now(),
            n: (this[ type ].n || 0) + 1,
        };
    }

    add(...eventNames) {
        if(Array.isArray(eventNames[ 0 ])) {    // "Single argument" assumption, overload
            eventNames = eventNames[ 0 ];
        }

        for(let eventName of eventNames) {
            this[ eventName ] = {};     
            this.__handlers[ eventName ] = (...args) => this.__updateFn.call(this, eventName, ...args);       

            this.__emitter.on(eventName, this.__handlers[ eventName ]);
        }
    }
    remove(...eventNames) {
        if(Array.isArray(eventNames[ 0 ])) {    // "Single argument" assumption, overload
            eventNames = eventNames[ 0 ];
        }

        for(let eventName of eventNames) {
            this.__emitter.off(eventName, this.__handlers[ eventName ]);
            
            delete this[ eventName ];
            delete this.__handlers[ eventName ];
        }
    }
}

//? Use the .Factory method to create a <Observable> with default state
export function Factory(eventEmitter, events, opts = {}) {
    return new EventObservable(eventEmitter, events, opts);
};

export function SubjectFactory(eventEmitter, events, opts = {}) {
    return new Observer(EventObservable.Factory(eventEmitter, events, opts));
};

EventObservable.Factory = Factory;
EventObservable.SubjectFactory = SubjectFactory;

export default EventObservable;