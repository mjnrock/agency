import Network from "../../event/Network";

//TODO  Setup a reducer/dispatch paradigm for React

export class ReactNetwork extends Network {
    constructor(state = {}, alter = {}) {
        super(state, alter);

        this.alter({
            $routes: [
                message => "react",
            ],
            react: {
                handlers: {
                    "*": (msg) => console.log(msg.type),
                },
                globals: {
                    network: this,
                },
            },
        });
    }

    reduce([ state, oldState ], globals = {}) {
        console.log(state)
        console.log(oldState)
        console.log(globals)
    }
};

export default ReactNetwork;