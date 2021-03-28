export function seedObject(keys = [], fn = () => null) {
    const obj = {};
    for(let key of keys) {
        if(key.includes(".")) {
            const topkey = key.slice(0, key.indexOf("."));
            const subkey = key.slice(key.indexOf(".") + 1);

            obj[ topkey ] = (obj[ topkey ] || {});
            obj[ topkey ] = {
                ...obj[ topkey ],
                ...seedObject([ subkey ], fn),
            };
        } else {
            obj[ key ] = fn(key);
        }
    }

    return obj;
};
// console.log(JSON.stringify(seedObject([ "world", "x", "y", "cat.dog", "cat.fish", "cat.fish.a" ], () => 1)));

/**
 * ! This may produce shallowly-unantipicated rounding calculations.  (cf. Math.round for nuances)
 */
export function round(number, scalar = 10) {
    return Math.round((number + Number.EPSILON) * scalar) / scalar;     // Number.EPSILON ensures e.g. round(1.005, 100) --> 1.01
};
// console.log(round(15.5498, 10))  // e.v. 15.5, not 15.6

export function clamp(value, { min, max } = {}) {
    let result = value;

    if(typeof min === "number") {
        result = Math.max(min, result);
    }
    if(typeof max === "number") {
        result = Math.min(max, result);
    }

    return result;
};
// console.log(clamp(29, { min: 10, max: 20 }))

export default {
    seedObject,
    round,
    clamp,
};