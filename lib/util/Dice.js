"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Dice = {
	random: function random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	roll: function roll(x, y) {
		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

		var value = 0;
		for (var i = 0; i < x; i++) {
			value += Dice.random(1, y);
		}

		return value + z;
	},

	permille: function permille() {
		var threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.500;

		return Dice.random(1, 1000) / 1000 >= threshold;
	},
	percento: function percento() {
		var threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.50;

		return Dice.random(1, 100) / 100 >= threshold;
	},
	chance: function chance(min, max) {
		var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
		var scalar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;

		return Math.round(Dice.random(min, max) / max * scalar) / scalar >= threshold;
	},
	coin: function coin() {
		return Dice.roll(1, 2) === 1 ? true : false;
	},

	d2: function d2() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var z = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(x, 2) + z;
	},
	d3: function d3() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var z = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(x, 3) + z;
	},
	d4: function d4() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var z = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(x, 4) + z;
	},
	d6: function d6() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var z = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(x, 6) + z;
	},
	d10: function d10() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var z = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(x, 10) + z;
	},
	d12: function d12() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var z = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(x, 12) + z;
	},
	d20: function d20() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var z = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(x, 20) + z;
	},
	d25: function d25() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var z = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(x, 25) + z;
	},
	d50: function d50() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var z = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(x, 50) + z;
	},
	d100: function d100() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var z = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(x, 100) + z;
	},

	weighted: function weighted(weights, values) {
		var total = weights.agg(function (a, v) {
			return a + v;
		}, 0);
		var roll = Dice.random(1, total);

		var count = 0;
		for (var i = 0; i < weights.length; i++) {
			count += weights[i];

			if (roll <= count) {
				return values[i];
			}
		}

		return values[values.length - 1];
	}
};

exports.default = Dice;