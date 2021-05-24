export class Console {
	static NewContext() {
		console.clear();
		Console.br(2);
		console.warn(`***************************************************`);
		console.warn(`*************| NEW EXECUTION CONTEXT |*************`);
		console.warn(`***************************************************`);
		Console.br(2);

		return this;
	}

	static clear(...args) {
		console.clear(...args);

		return this;
	}
	static log(...args) {
		console.log(...args);

		return this;
	}
	static info(...args) {
		console.info(...args);

		return this;
	}
	static warn(...args) {
		console.warn(...args);

		return this;
	}
	static error(...args) {
		console.error(...args);

		return this;
	}

	static br(times = 1) {
		for(let i = 0; i < times; i++) {
			console.log(``);
		}

		return this;
	}
	static hr(count = 5, symbol = "-") {
        console.log(Array.apply(null, Array(count)).map(() => symbol).join(""));

		return this;
	}

	static section(text) {
		Console.br(1);
		console.log(`=================================`);
		console.log(`==========| ${ text } |==========`);
		console.log(`=================================`);
		Console.br(1);

		return this;
	}
	static sub(text) {
		Console.br(1);
		console.log(`---------------------------------`);
		console.log(`----------| ${ text } |----------`);
		console.log(`---------------------------------`);
		Console.br(1);

		return this;
	}

	static h1(text) {
		Console.br(1);
		console.log(`==========| ${ text } |==========`);
		Console.br(1);

		return this;
	}
	static h2(text) {
		Console.br(1);
		console.log(`----------| ${ text } |----------`);
		Console.br(1);

		return this;
	}
}

export default Console;