import ReactNetwork from "../../src/react/ReactNetwork";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const rn = new ReactNetwork({
    cat: 2,
});

rn.state = {
    ...rn.state,
    cats: 1545,
};