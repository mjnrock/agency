export class Console {
	static NewContext() {
		console.clear();
		console.warn(`*************************************************`);
		console.warn(`************* NEW EXECUTION CONTEXT *************`);
		console.warn(`*************************************************`);
		Console.br(1);

		return this;
	}

	static clear(...args) {
		console.clear(...args);
	}
	static log(...args) {
		console.log(...args);
	}
	static info(...args) {
		console.info(...args);
	}
	static warn(...args) {
		console.warn(...args);
	}
	static error(...args) {
		console.error(...args);
	}

	static br(times = 1) {
		for(let i = 0; i < times; i++) {
			console.log(``);
		}

		return this;
	}
	static hr(count = 5, symbol = "-") {
        console.log(Array.apply(null, Array(count)).map(() => symbol).join(""));
	}

	static h1(text) {
		Console.br(1);
		console.log(`=====================`);
		console.log(`===== ${ text } =====`);
		console.log(`=====================`);
		Console.br(1);

		return this;
	}
	static h2(text) {
		Console.br(1);
		console.log(`===== ${ text } =====`);
		Console.br(1);

		return this;
	}
	static h3(text) {
		Console.br(1);
		console.log(`----- ${ text } -----`);
		Console.br(1);

		return this;
	}
}

export default Console;