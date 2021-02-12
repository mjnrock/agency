import Context from "../../v1/Context";
import Validator from "../../v1/Validator";
import Registry from "../../v1/Registry";
import Observer from "../../v1/Observer";

const ctx = new Context("Attributes", {
    state: {
        ATK: 2,
        DEF: 1,
        HP: [ 10, 10 ],
    },
    reducers: [
        (state) => state,
    ]
});
const obs = new Observer(ctx, console.log);

const reg = new Registry();
reg.alias(new Validator(
    (state) => {
        const [ curr, max ] = state.HP;

        if(curr >= 0 && curr <= max) {
            return true;
        }
        
        return false;
    }
), "IsAlive");


ctx.attach(reg.get("IsAlive"));
ctx.run([ ctx.state ]);