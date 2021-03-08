import Observable from "./Observable";
import Observer from "./Observer";

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
 *      local this[ eventName ] object, thus triggering
 *      any attached <Observer> to broadcast the data.
 *      
 * The <EventObservable> will cache the previous (n-1)
 *      data so that comparative analysis can be performed.
 * 
 * ! Because of the getter/setters on <Observable>, you
 * !    cannot follow a "next" event; you must specify
 * !    the specific properties, if wrapping an "nextable".
 */
export class EventObservable extends Observable {
    constructor(eventEmitter, events = []) {
        super(false, { noWrap: true });

        this.__emitter = eventEmitter;
        this.__handlers = {};

        const _this = new Proxy(this, {
            get(target, prop) {
                return target[ prop ];
            },
            set(target, prop, value) {
                target[ prop ] = value;
                target.next(prop, target[ prop ]);

                return target;
            }
        });

        _this.add(...events);

        return _this;
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
            this.__handlers[ eventName ] = (...args) => this.__updateFn(eventName, ...args);

            this.__emitter.on(eventName, this.__handlers[ eventName ]);
        }

        return this;
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

        return this;
    }
}

//? Use the .Factory method to create a <Observable> with default state
export function Factory(eventEmitter, events) {
    return new EventObservable(eventEmitter, events);
};

export function SubjectFactory(eventEmitter, events, opts = {}) {
    return new Observer(EventObservable.Factory(eventEmitter, events, opts));
};

EventObservable.Factory = Factory;
EventObservable.SubjectFactory = SubjectFactory;

export default EventObservable;