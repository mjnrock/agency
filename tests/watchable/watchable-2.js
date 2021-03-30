import Watchable from "../../src/v4/Watchable";
import Watcher from "../../src/v4/Watcher";
import Registry from "../../src/v4/Registry";

console.log("---------===================----------");

const component1a = new Watchable({ a: 1 }, { deep: false });
const component1b = new Watchable({ a: 1 }, { deep: false });
const component2 = new Watchable({ b: 2 }, { deep: false });

const entity1 = new Watchable({
    A: component1a,
});
const entity2 = new Watchable({
    A: component1b,
    B: component2,
});

const entityManager = new Registry();
entityManager.register(entity1);
entityManager.register(entity2);

// entity1.$.subscribe(function(prop, value) { console.log(`==> ENTITY1 <==`, this.subject, prop, value) });
// entity2.$.subscribe(function(prop, value) { console.log(`==> ENTITY2 <==`, this.subject, prop, value) });
entityManager.$.subscribe(function(prop, value) { console.log(`==> ENTITY MGR <==`, this, prop, value) });


entity1.A.a = 4;

console.log("---------===================----------");