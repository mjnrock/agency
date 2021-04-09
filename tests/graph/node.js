import AgencyBase from "./../../src/AgencyBase";

import $Node from "./../../src/graph/$Node";
import $Edge from "./../../src/graph/$Edge";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const n1 = new ($Node(AgencyBase))();
const n2 = new ($Node(AgencyBase))();
const edge = new ($Edge(AgencyBase))({
    Edge: {
        nodes: [ n2 ],
    }
});

n1.edges.register(edge);

console.log(n1)
console.log(n2)
console.log(edge)

n1.request({ cats: 2 });