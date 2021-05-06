import AgencyBase from "./../AgencyBase";

export class Channel extends AgencyBase {
    static Signals = {
        UPDATE: `Channel.Update`,
    };

    constructor(state = {}) {
        super();

        this.__state = state;
    }

    get state() {
        return this.__state;
    }
    set state(state) {
        let oldState = Object.assign({}, this.__state),
            newState = Object.assign({}, state);

        this.__state = state;

        this.emit(this, Channel.Signals.UPDATE, newState, oldState);
    }
};

export default Channel;