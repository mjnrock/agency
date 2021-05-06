import Dispatcher from "./Dispatcher";

export const $DispatchState = $super => class extends $super {
    constructor({ DispatchState = {}, ...rest } = {}) {
        super({ ...rest });

        this.__state = DispatchState.state;
        this.__dispatcher = new Dispatcher(DispatchState.network, DispatchState.subject);
        this.__stateDispatchEvent = DispatchState.event;
    }

    get state() {
        return this.__state;
    }
    set state(state) {
        let oldState = Object.assign({}, this.__state),
            newState = Object.assign({}, state);

        this.__state = state;

        this.__dispatcher.dispatch(this.__stateDispatchEvent, newState, oldState);
    }
};

export default $DispatchState;