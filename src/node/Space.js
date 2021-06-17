import Network from "./../event/Network";
import AgencySet from "../AgencySet";
import AgencyMap from "../AgencyMap";

import Field from "./Field";

export class Space extends Network {
	constructor({ fields = [], modify = {} } = {}) {
		super({
			fields: new AgencySet(fields),
		}, {
			default: {
				[ Network.Signal.UPDATE ]: msg => console.log(msg),
			},
			...modify,
		});

		// this.state.fields.hook({
		// 	"*": msg => console.log("SET", msg)
		// })
	}

	addField(field) {
		if(field instanceof Field) {
			this.state.fields.add(field);
		}
	}
};

export default Space;