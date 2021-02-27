import { v4 as uuidv4, validate } from "uuid";
import Observable from "./Observable";

export class Registry extends Observable {
    constructor(deep = true) {
        super(false, { noWrap: true });
            
        return new Proxy(this, {
            get(target, prop) {
                if(!validate(prop) && validate(target[ prop ])) {   // prop is NOT a uuid AND target[ prop ] IS a uuid --> prop is a synonym
                    const entry = target[ target[ prop ] ];

                    if(entry !== void 0) {
                        return entry;
                    }
                }

                return target[ prop ];
            },
            set(target, prop, value) {
                console.log(prop, value)
                if(validate(prop) || validate(value)) {
                    if(deep && value instanceof Observable) {
                        const ob = value;
                        ob.next = (...args) => {
                            const props = [ prop, ...args.slice(0, args.length - 1) ].join(".");
        
                            target.next(props, args.pop());
                        };
        
                        target[ prop ] = ob;
                    } else {
                        target[ prop ] = value;
                    }
        
                    target.next(prop, target[ prop ]);
                } else if(prop === "next") {
                    target[ prop ] = value;
                }
    
                return target;
            }
        });
    }

    register(entry, ...synonyms) {
        let uuid = (entry || {}).__id || uuidv4();
        
        this[ uuid ] = entry;

        for(let synonym of synonyms) {
            this[ synonym ] = uuid;
        }

        return this;
    }
    unregister(entryOrId) {
        let uuid = validate(entryOrId) ? entryOrId : (entryOrId || {}).__id;
        
        if(uuid) {
            const entry = this[ uuid ];
            for(let [ key, value ] of Object.entries(this)) {
                if(value === entry) {   // this[ synonym ] will return the this[ uuid ], because of the Proxy get trap, thus @entry
                    delete this[ key ];
                }
            }

            delete this[ uuid ];
        }

        return this;
    }
};

export default Registry;