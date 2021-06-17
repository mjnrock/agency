import Emitter from "./../event/Emitter";

export class Field extends Emitter {
	constructor(size = [], { nodes = [], entities = [] } = {}) {
		super({

		});

		this.size = [ ...size, 0, 0, 0 ].slice(0, 3);

		this.nodes = nodes;
		this.entities = entities;
	}

	get x() {
		return this.size[ 0 ];
	}
	set x(x) {
		this.size[ 0 ] = x;
	}

	get y() {
		return this.size[ 1 ];
	}
	set y(y) {
		this.size[ 1 ] = y;
	}

	get z() {
		return this.size[ 2 ];
	}
	set z(z) {
		this.size[ 2 ] = z;
	}

	get sizeObj() {
		return {
			x: this.x,
			y: this.y,
			z: this.z,
		};
	}
};

export default Field;