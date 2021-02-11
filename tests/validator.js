import Validator from "../Validator2";

const val1 = new Validator();
val1.bias = (bias, fn) => bias > 0.6;

// val1.add(input => input === true);
// val1.add(0.53, input => input === true);
// val1.add(input => input === true, input => input === true, input => input === true);
val1.add([
    [ 0.6, input => input === false ],
    [ 0.2, input => input === false ],
    [ 0.8, input => input === false ],
]);

val1.bias = Validator.BiasType.MAX(0.9);

let a;
console.log("---------");
a = val1.run(0, false);
console.log(a);
a = val1.run(0, true);
console.log(a);
a = val1.run(2, true);
console.log(a);
a = val1.run(4, true);
console.log(a);
a = val1.run(6, true);
console.log(a);