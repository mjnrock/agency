const Dice = {
	random: (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	roll: (x, y, z = 0) => {
		let value = 0;
		for(let i = 0; i < x; i++) {
			value += Dice.random(1, y);
		}
		
		return value + z;
	},

    permille: (threshold = 0.500) => {
        return (Dice.random(1, 1000) / 1000) >= threshold;
    },
    percento: (threshold = 0.50) => {
        return (Dice.random(1, 100) / 100) >= threshold;
    },
    chance: (min, max, threshold = 0.5, scalar = 1000) => {
        return Math.round((Dice.random(min, max) / max) * scalar) / scalar >= threshold;
    },
	coin: () => {
		return Dice.roll(1, 2) === 1 ? true : false;
	},

	d2: (x = 1, z = 0) => {
		return Dice.roll(x, 2) + z;
	},
	d3: (x = 1, z = 0) => {
		return Dice.roll(x, 3) + z;
	},
	d4: (x = 1, z = 0) => {
		return Dice.roll(x, 4) + z;
	},
	d6: (x = 1, z = 0) => {
		return Dice.roll(x, 6) + z;
	},
	d10: (x = 1, z = 0) => {
		return Dice.roll(x, 10) + z;
	},
	d12: (x = 1, z = 0) => {
		return Dice.roll(x, 12) + z;
	},
	d20: (x = 1, z = 0) => {
		return Dice.roll(x, 20) + z;
	},
	d25: (x = 1, z = 0) => {
		return Dice.roll(x, 25) + z;
	},
	d50: (x = 1, z = 0) => {
		return Dice.roll(x, 50) + z;
	},
	d100: (x = 1, z = 0) => {
		return Dice.roll(x, 100) + z;
	},

	weighted: (weights, values) => {                
		const total = weights.agg((a, v) => a + v, 0);		
		const roll = Dice.random(1, total);
		
		let count = 0;
		for(let i = 0; i < weights.length; i++) {
			count += weights[ i ];
			
			if(roll <= count) {
				return values[ i ];
			}
		}
		
		return values[ values.length - 1 ];
	}
}

export default Dice;