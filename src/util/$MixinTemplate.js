export const $MixinTemplate = $super => class extends $super {
    constructor({ MixinTemplate = {}, ...rest } = {}) {
        super({ ...rest });

        //  @MixinTemplate should be given any instantiation variables this mixin will need
    }

    //  Add methods
};

export default $MixinTemplate;