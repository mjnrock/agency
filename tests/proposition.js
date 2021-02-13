import Proposition from "../src/Proposition";

const val1 = new Proposition();
val1.add(
    (...args) => {
        console.log(...args);

        return true;
    },
    () => false
);

val1.run("cats");