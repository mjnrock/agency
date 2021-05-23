import Deckski from "../../src/modules/deck/package";

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

const c1 = new Deckski.Card({
	cat: "Kiszka",
}, {
	hooks: {
		"*": msg => console.log(`[Kiszka]:`, msg.type, msg.data),
	},
});
const c2 = new Deckski.Card({
	cat: "Buddha",
}, {
	hooks: {
		"*": msg => console.log(`[Buddha]:`, msg.type, msg.data),
	},
});

// This is necessary to keep a memory reference to the function
const hooks = {
	"**": msg => console.log("HOOKED"),
};
c1.$hook(hooks);
console.log(c1);
console.log(c2);

c1.color = "Calico";

c1.$hook({
	$delete: {
		...hooks,
	},
});
c1.color = "Calico2";
c2.color = "Buddha";



console.log(c1);
console.log(c2);