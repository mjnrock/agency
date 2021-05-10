import Network from "./../event/Network";

//TODO  Setup a reducer/dispatch paradigm for React

export class ReactNetwork extends Network {
    constructor(state = {}, modify = {}) {
        super(state, modify);

        this.alter({
            $routes: [
                message => "react",
            ],
            react: {
                handlers: {
                    [ Network.Signals.CONSUME ]: msg => {
                        console.log(msg)
                    },
                },
            },
            _internal: {
                handlers: {
                    [ Network.Signals.UPDATE ]: this.consume.bind(this),
                },
                globals: {
                    react: this,
                }
            }
        })
    }

    reduce([ state, oldState ], globals = {}) {

    }
};

export default ReactNetwork;