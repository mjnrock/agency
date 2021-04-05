import Registry from "./Registry";

export const $Multiton = $super => class extends $super {
    static Instances = new Registry();
    /**
     * A convenience getter to easily access a default <Registry>
     *  when a multi-Registry setup is unnecessary.
     */
    static get $() {
        if(!(this.Instances || {}).default) {
            this.Recreate();
        }

        return this.Instances.default;
    }
    static get _() {
        if(!this.Instances) {
            this.Recreate();
        }

        return this.Instances;
    }
    
    /**
     * Recreate the .Instances registry
     */
    static Recreate(registerArgs = [], createDefault = true, defaultArgs = []) {
        this.Instances = new Registry();

        for(let entry of registerArgs) {
            if(Array.isArray(entry)) {
                const [ _this, ...synonyms ] = entry;

                if(_this instanceof this) {
                    this.Instances.register(_this, ...synonyms);
                }
            } else {
                this.Instances.register(entry);
            }
        }

        if(createDefault) {
            this.Instances.register(new this(...defaultArgs), "default");
        }
    }

    constructor({ ...rest } = {}) {
        super({ ...rest });
    }
};

export default $Multiton;