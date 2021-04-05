import AgencyBase from "../src/AgencyBase";
import { MixinBase } from "../src/index";
import $Multiton from "../src/$Multiton";
import Registry from "../src/Registry";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

class Test extends $Multiton(class {}) {}
Test.Recreate([
    [ new Registry(), "dogs" ],
    [ new Test(), "cats" ],
])

console.log(Test.$)
console.log(Test.Instances)
console.log(Test.Instances.default)
console.log(Test.Instances.cats)
console.log(Test.Instances.dogs)