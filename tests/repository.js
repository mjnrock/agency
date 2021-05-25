import Console from "../src/util/Console";

import Repository from "../src/Repository";

Console.NewContext();

let id;
const repo = new Repository({
	config: {
		accessor(target, prop) {
			return 15;
		},
	},
	hooks: {
		[ Repository.Signal.REGISTER ]: msg => {
			[ id ] = msg.data;
			console.log(msg.type, msg.data);
		},
		[ Repository.Signal.UNREGISTER ]: msg => console.log(msg.type, msg.data),
	},
});

Console.sub(`Events`);
repo.register({
	cat: true,
}, {
	forceInjectId: true,
});
repo.unregister(id)

Console.sub(`Repository`);
Console.log(repo)