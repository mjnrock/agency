export function pipe(...fns) {
    return args => fns.reduce((arg, fn) => fn(arg), args);
};
export function compose(...fns) {
    return args => fns.reduceRight((arg, fn) => fn(arg), args);
};

export function flatten(obj, { chain = "", asArray = false } = {}) {
    let result = {};
    for(let [ key, entry ] of Object.entries(obj)) {
        let newKey = chain.length ? `${ chain }.${ key }` : key;

        if(typeof entry === "object" && !Array.isArray(entry)) {
            result = {
                ...result,
                ...flatten(entry, { chain: newKey }),
            }
        } else {
            result[ newKey ] = entry;
        }
    }

    if(asArray) {
        return Object.entries(result);
    }

    return result;
};

export function seedObject(keys = [], fn = () => null) {
    const obj = {};
    for (let key of keys) {
        if (key.includes(".")) {
            const index = key.indexOf(".");
            const topkey = key.slice(0, index);
            const subkey = key.slice(index + 1);

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
    if (arguments.length === 3) {
        min = arguments[ 1 ];
        max = arguments[ 2 ];
    }

    let result = value;

    if (typeof min === "number") {
        result = Math.max(min, result);
    }
    if (typeof max === "number") {
        result = Math.min(max, result);
    }

    return result;
};
// console.log(clamp(29, { min: 10, max: 20 }))

/**
 * A wrapper function to invoke if you want to amend various prototypes
 * Current:
 *  - Array
 */
export function extendJavascript() {
    Array.range = function (n) {
        // Array.range(5) --> [0,1,2,3,4]
        return Array.apply(null, Array(n)).map((x, i) => i);
    };
    
    Object.defineProperty(Array.prototype, "chunk", {
        value: function (n) {
    
            // ACTUAL CODE FOR CHUNKING ARRAY:
            return Array.range(Math.ceil(this.length / n)).map((x, i) => this.slice(i * n, i * n + n));
    
        }
    });
}

export default {
    pipe,
    compose,
    seedObject,
    round,
    clamp,

    extendJavascript,
};