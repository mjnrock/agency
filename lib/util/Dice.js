"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Dice = exports.Dice = {
	random: function random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	/**
  * This is a normal XdY+Z setup.
  */
	roll: function roll(number, sided) {
		var bonus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

		var value = 0;
		for (var i = 0; i < number; i++) {
			value += Dice.random(1, sided);
		}

		return value + bonus;
	},
	/**
  * This applies the @perRollBonus to each drop,
  * instead of once after all rolls have been made.
  */
	roll2: function roll2(number, sided) {
		var perRollBonus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

		var value = 0;
		for (var i = 0; i < number; i++) {
			value += Dice.random(1, sided) + perRollBonus;
		}

		return value;
	},

	/**
  * 1/1000 roller with @threshold as a decimal [0.000, 1.000]
  */
	permille: function permille() {
		var threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.500;

		return Dice.random(1, 1000) / 1000 <= threshold;
	},
	/**
  * 1/100 roller with @threshold as a decimal [0.00, 1.00]
  */
	percento: function percento() {
		var threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.50;

		return Dice.random(1, 100) / 100 <= threshold;
	},
	/**
  * A convenience function to calculate irregular chances.
  * @scalar truncates the precision of the randomization.
  */
	chance: function chance(min, max) {
		var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
		var scalar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10000;

		return Math.round(Dice.random(min, max) / max * scalar) / scalar >= threshold;
	},
	/**
  * 50/50 chance, returning true or false
  */
	coin: function coin() {
		return Dice.roll(1, 2) === 1 ? true : false;
	},
	/**
  * 50/50 chance, returning 1 or 0
  */
	coin2: function coin2() {
		return Dice.roll(1, 2) === 1 ? 1 : 0;
	},

	//NOTE  Common dice configuration convenience methods
	d2: function d2() {
		var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var bonus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(number, 2, bonus);
	},
	d3: function d3() {
		var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var bonus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(number, 3, bonus);
	},
	d4: function d4() {
		var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var bonus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(number, 4, bonus);
	},
	d6: function d6() {
		var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var bonus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(number, 6, bonus);
	},
	d10: function d10() {
		var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var bonus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(number, 10, bonus);
	},
	d12: function d12() {
		var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var bonus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(number, 12, bonus);
	},
	d20: function d20() {
		var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var bonus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(number, 20, bonus);
	},
	d25: function d25() {
		var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var bonus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(number, 25, bonus);
	},
	d50: function d50() {
		var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var bonus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(number, 50, bonus);
	},
	d100: function d100() {
		var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		var bonus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		return Dice.roll(number, 100, bonus);
	},

	/**
  * A weighted pool, where @weights.length === @values.length
  * e.g. weights = [ 1, 2, 1 ], values = [ "a", "b", "c" ]
  */
	weighted: function weighted() {
		var weights = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
		var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

		var total = weights.reduce(function (a, v) {
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
	},
	/**
  * A weighted pool using pairs, instead
  * e.g. weightValuePairs = [ [ 1, "a" ], ..., [ 26, "z" ] ]
  */
	weighted2: function weighted2() {
		var weightValuePairs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		var total = weightValuePairs.reduce(function (a, v) {
			return a + v[0];
		}, 0);
		var roll = Dice.random(1, total);

		var count = 0;
		for (var i = 0; i < weightValuePairs.length; i++) {
			count += weightValuePairs[i][0];

			if (roll <= count) {
				return weightValuePairs[i][1];
			}
		}

		return weightValuePairs[weightValuePairs.length - 1][1];
	}
};

exports.default = Dice;