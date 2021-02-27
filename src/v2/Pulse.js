/* eslint-disable */
import MainLoop from "mainloop.js";
import Mutator from "./Mutator";

import Observable from "./Observable";
import Observer from "./Observer";

export class Pulse extends Observable {
    constructor(bps = 30, { autostart = true } = {}) {
        super(false);

        this._bps = bps;
        this.tick = {};

        this.loop = MainLoop.setBegin(this.pre.bind(this))
            .setUpdate(this.update.bind(this))
            .setDraw(this.draw.bind(this))
            .setEnd(this.post.bind(this))
            .setSimulationTimestep(this.spb);

        if(autostart) {
            this.start();
        }
    }

    get bps() {
        return this._bps;
    }
    set bps(fps) {
        this._bps = fps;

        if(this.isRunning === true) {
            this.stop();
            this.start();
        }
    }
    get spb() {
        return 1000 / this.bps;
    }

    start() {
        this.loop.start();

        return this;
    }
    stop() {
        this.loop.stop();

        return this;
    }

    /**
     * @param {number} ts Total elapsed time
     * @param {number} dt Frame delta in ms
     */
    pre(ts, dt) {}

    /**
     * @param {number} dt Frame delta in ms
     */
    update(dt) {
        this.tick = {
            dt,
            now: Date.now(),
        };
    }

    /**
     * @param {number} interpolationPercentage A factor between 0.0 and 1.0, used as a scaling weight similar to delta time
     */
    draw(interpolationPercentage) {
        // console.log("%", interpolationPercentage);   //TODO Figure out how to add these "rendering fractional steps" into implementation
    }

    post(fps, panic) {
        if (panic) {
            let discardedTime = Math.round(MainLoop.resetFrameDelta());
            console.warn("Main loop panicked, probably because the browser tab was put in the background. Discarding ", discardedTime, "ms");
        }
    }
}

//  Create a new <Pulse>
export function Factory(bps, opts = {}) {
    return new Pulse(bps, opts);
};

//  Create an <Observer> from an NON-EXISTING <Pulse> via Pulse.Factory(...args)
export function Generate(bps, opts = {}, ontick) {
    const obs = new Observer(Pulse.Factory(bps, opts));

    //  Attach an optional "tick" listener
    if(typeof ontick === "function") {
        obs.on("tick", ontick);
    } else if(ontick instanceof Mutator) {
        obs.on("tick", ontick.process);
    }

    return obs;
};

Pulse.Factory = Factory;
Pulse.Generate = Generate;

export default Pulse;