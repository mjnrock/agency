import $Router, { EnumRouteType } from "./$Router";
import $Registry from "../$Registry";

import Context from "./Context";

export class EventBus extends $Registry($Router) {
    constructor() {
        super({
            Router: {
                routes: [],
                type: EnumRouteType.MatchFirst
            },
        });
        
        this.config = {
            isBatchProcess: true,
        };
    }

    matchFirst() {
        this.type = EnumRouteType.MatchFirst;

        return this;
    }
    matchAll() {
        this.type = EnumRouteType.MatchAll;

        return this;
    }

    useRealTimeProcess() {
        this.config.isBatchProcess = false;

        for(let context of this) {
            if(context instanceof Context) {
                context.useRealTimeProcess();
            }
        }

        return this;
    }
    useBatchProcess() {
        this.config.isBatchProcess = true;

        for(let context of this) {
            if(context instanceof Context) {
                context.useBatchProcess();
            }
        }

        return this;
    }


    createContext(name, ...args) {
        const context = new Context(...args);

        this.register(context, name);

        if(this.config.isBatchProcess) {
            context.useBatchProcess();
        } else {
            context.useRealTimeProcess();
        }

        return context;
    }
    createContexts(createContextArgs = []) {
        let contexts = [];
        for(let [ name, ...args ] of createContextArgs) {
            contexts.push(this.createContext(name, ...args));
        }

        return contexts;
    }
    
    destroyContext(nameOrContext) {
        return this.unregister(nameOrContext);
    }
    destroyContexts(destroyContextArgs = []) {
        let results = [];
        for(let [ name, ...args ] of destroyContextArgs) {
            results.push(this.destroyContext(name, ...args));
        }

        return results;
    }


    process(contexts = []) {
        if(contexts.length === 0) {
            for(let context of this) {
                context.process();
            }

            return this;
        }

        for(let nameOrContext of contexts) {
            const context = this[ nameOrContext ];

            if(context instanceof Context) {
                context.process();
            }
        }

        return this;
    }
};

export default EventBus;