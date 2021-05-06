import { BasicNetwork } from "../../src/event/Network";
import Dispatcher from "../../src/event/Dispatcher";
import Emitter from "../../src/event/Emitter";

console.warn("------------ NEW EXECUTION CONTEXT ------------");

const e1 = new Emitter();
const e2 = new Emitter();

const root = new BasicNetwork();
const mid1 = new BasicNetwork({
    test: BasicNetwork.Relay,
});
const mid2 = new BasicNetwork();
const child11 = new BasicNetwork();
const child12 = new BasicNetwork();
const child21 = new BasicNetwork();
const child22 = new BasicNetwork();

const dr = new Dispatcher(root, true);
const dm1 = new Dispatcher(mid1, true);
const dm2 = new Dispatcher(mid2, true);

mid1.link(root);
mid2.link(root);

child11.link(mid1);
child12.link(mid1);
child21.link(mid2);
child22.link(mid2);

root.router.default.addHandler("test", function(data) {
    console.log(this.emitter.id);
    console.log([ ...this.provenance ].map(p => p.id));
    console.log(data);
});


dr.dispatch("test", 1);     // Should reach console
dm1.dispatch("test", 2);     // Should reach console, via @mid1 route
dm2.dispatch("test", 3);     // Should NOT reach console, no @mid2 route

dm1.broadcast("test", 4);     // Should reach console, @mid1 link to @root
dm2.broadcast("test", 5);     // Should reach console, @mid2 link to @root


// root.emit(e1, "test", 1);     // Should reach console
// mid1.broadcast(e1, "test", 2);     // Should reach console
// mid2.broadcast(e1, "test", 3);     // Should reach console
// child11.broadcast(e2, "test", 6);        // Should reach console
// child12.broadcast(e2, "test", 7);        // Should reach console
// child21.broadcast(e2, "test", 8);        // Should NOT reach console
// child22.broadcast(e2, "test", 9);        // Should NOT reach console