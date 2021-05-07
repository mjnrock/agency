export function pipe(...fns) {
    return args => fns.reduce((arg, fn) => fn(arg), args);
};
export function compose(...fns) {
    return args => fns.reduceRight((arg, fn) => fn(arg), args);
};
export function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function (...args2) {
                return curried.apply(this, args.concat(args2));
            }
        }
    };
};

export function flatten(obj, { chain = "", asArray = false, joiner = "." } = {}) {
    let result = {};
    for (let [ key, entry ] of Object.entries(obj)) {
        let newKey = chain.length ? `${chain}${joiner}${key}` : key;

        if (typeof entry === "object" && !Array.isArray(entry)) {
            result = {
                ...result,
                ...flatten(entry, { chain: newKey }),
            }
        } else {
            result[ newKey ] = entry;
        }
    }

    if (asArray) {
        return Object.entries(result);
    }

    return result;
};
export function unflatten(obj, { splitter = "." } = {}) {
    const nester = (chain = [], parent = {}, entry) => {
        if (chain.length > 1) {
            let newKey = chain.shift();
            parent[ newKey ] = {
                ...(parent[ newKey ] || {}),
                ...nester(chain, parent[ newKey ], entry),
            }
        } else {
            parent[ chain.shift() ] = entry;
        }

        return parent;
    };

    if (Array.isArray(obj)) {
        obj = Object.fromEntries(obj);
    }

    if (typeof obj === "object") {
        let result = {};

        for (let [ key, entry ] of Object.entries(obj)) {
            result = nester(key.split(splitter), result, entry);
        }

        return result;
    }

    return obj;
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
// console.log(seedObject([ "world", "x", "y", "cat.dog", "cat.fish", "cat.fish.a" ], (key) => {
//     if(key === "world") {
//         return 14;
//     }
    
//     return 1;
// }));

/**
 * ! This may produce shallowly-unantipicated rounding calculations.  (cf. Math.round for nuances)
 */
// console.log(round(15.5498, 10))  // e.v. 15.5, not 15.6
export function round(number, scalar = 10) {
    return Math.round((number + Number.EPSILON) * scalar) / scalar;     // Number.EPSILON ensures e.g. round(1.005, 100) --> 1.01
};
export function floor(number, scalar = 10) {
    return Math.floor((number + Number.EPSILON) * scalar) / scalar;     // Number.EPSILON ensures e.g. round(1.005, 100) --> 1.01
};
export function ceil(number, scalar = 10) {
    return Math.ceil((number + Number.EPSILON) * scalar) / scalar;     // Number.EPSILON ensures e.g. round(1.005, 100) --> 1.01
};

export function between(number, min, max, inclusive = true, scalar) {
    if (scalar != null) {
        number = round(number, scalar);
        min = round(min, scalar);
        max = round(max, scalar);
    }

    if (inclusive) {
        return number >= min && number <= max;
    }

    return number > min && number < max;
};
export function near(number, anchor, margin = 0, scalar = 1000) {
    let num = round(number, scalar);
    let anch = round(anchor, scalar);

    return between(num, anch - margin, anch + margin);
};

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
        // Array.range(5) --> [ 0, 1, 2, 3, 4 ]
        return Array.apply(null, Array(n)).map((x, i) => i);
    };

    Object.defineProperty(Array.prototype, "chunk", {
        value: function (n) {
            return Array.range(Math.ceil(this.length / n)).map((x, i) => this.slice(i * n, i * n + n));
        }
    });
};

/**
 * Create/return multiple instances/evaluations of a passed class/function.
 * 
 * @mutator(@i, @args) will be executed at the end of each loop.
 */
export function factory(fnOrClass, qty, args = [], mutator) {
    let results = [];
    for (let i = 0; i < qty; i++) {
        if (typeof fnOrClass === "function") {
            results.push(fnOrClass(...args));
        } else {
            results.push(new fnOrClass(...args));
        }

        if (typeof mutator === "function") {
            args = mutator(i, args);
        }
    }

    if (results.length) {
        return results;
    }

    return results[ 0 ];
}

export default {
    pipe,
    compose,
    curry,
    flatten,
    unflatten,
    seedObject,
    round,
    floor,
    ceil,
    between,
    near,
    clamp,

    extendJavascript,
    factory,
};