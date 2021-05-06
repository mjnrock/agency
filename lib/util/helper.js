"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.pipe = pipe;
exports.compose = compose;
exports.flatten = flatten;
exports.unflatten = unflatten;
exports.seedObject = seedObject;
exports.round = round;
exports.floor = floor;
exports.ceil = ceil;
exports.between = between;
exports.near = near;
exports.clamp = clamp;
exports.extendJavascript = extendJavascript;
exports.factory = factory;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function pipe() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
    }

    return function (args) {
        return fns.reduce(function (arg, fn) {
            return fn(arg);
        }, args);
    };
};
function compose() {
    for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        fns[_key2] = arguments[_key2];
    }

    return function (args) {
        return fns.reduceRight(function (arg, fn) {
            return fn(arg);
        }, args);
    };
};

function flatten(obj) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$chain = _ref.chain,
        chain = _ref$chain === undefined ? "" : _ref$chain,
        _ref$asArray = _ref.asArray,
        asArray = _ref$asArray === undefined ? false : _ref$asArray,
        _ref$joiner = _ref.joiner,
        joiner = _ref$joiner === undefined ? "." : _ref$joiner;

    var result = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.entries(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                entry = _step$value[1];

            var newKey = chain.length ? "" + chain + joiner + key : key;

            if ((typeof entry === "undefined" ? "undefined" : _typeof(entry)) === "object" && !Array.isArray(entry)) {
                result = _extends({}, result, flatten(entry, { chain: newKey }));
            } else {
                result[newKey] = entry;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    if (asArray) {
        return Object.entries(result);
    }

    return result;
};
function unflatten(obj) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$splitter = _ref2.splitter,
        splitter = _ref2$splitter === undefined ? "." : _ref2$splitter;

    var nester = function nester() {
        var chain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var entry = arguments[2];

        if (chain.length > 1) {
            var newKey = chain.shift();
            parent[newKey] = _extends({}, parent[newKey] || {}, nester(chain, parent[newKey], entry));
        } else {
            parent[chain.shift()] = entry;
        }

        return parent;
    };

    if (Array.isArray(obj)) {
        obj = Object.fromEntries(obj);
    }

    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object") {
        var result = {};

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Object.entries(obj)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _step2$value = _slicedToArray(_step2.value, 2),
                    key = _step2$value[0],
                    entry = _step2$value[1];

                result = nester(key.split(splitter), result, entry);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return result;
    }

    return obj;
};

function seedObject() {
    var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
        return null;
    };

    var obj = {};
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var key = _step3.value;

            if (key.includes(".")) {
                var index = key.indexOf(".");
                var topkey = key.slice(0, index);
                var subkey = key.slice(index + 1);

                obj[topkey] = obj[topkey] || {};
                obj[topkey] = _extends({}, obj[topkey], seedObject([subkey], fn));
            } else {
                obj[key] = fn(key);
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return obj;
};
// console.log(JSON.stringify(seedObject([ "world", "x", "y", "cat.dog", "cat.fish", "cat.fish.a" ], () => 1)));

/**
 * ! This may produce shallowly-unantipicated rounding calculations.  (cf. Math.round for nuances)
 */
// console.log(round(15.5498, 10))  // e.v. 15.5, not 15.6
function round(number) {
    var scalar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    return Math.round((number + Number.EPSILON) * scalar) / scalar; // Number.EPSILON ensures e.g. round(1.005, 100) --> 1.01
};
function floor(number) {
    var scalar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    return Math.floor((number + Number.EPSILON) * scalar) / scalar; // Number.EPSILON ensures e.g. round(1.005, 100) --> 1.01
};
function ceil(number) {
    var scalar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    return Math.ceil((number + Number.EPSILON) * scalar) / scalar; // Number.EPSILON ensures e.g. round(1.005, 100) --> 1.01
};

function between(number, min, max) {
    var inclusive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var scalar = arguments[4];

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
function near(number, anchor) {
    var margin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var scalar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;

    var num = round(number, scalar);
    var anch = round(anchor, scalar);

    return between(num, anch - margin, anch + margin);
};

function clamp(value) {
    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        min = _ref3.min,
        max = _ref3.max;

    if (arguments.length === 3) {
        min = arguments[1];
        max = arguments[2];
    }

    var result = value;

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
function extendJavascript() {
    Array.range = function (n) {
        // Array.range(5) --> [0,1,2,3,4]
        return Array.apply(null, Array(n)).map(function (x, i) {
            return i;
        });
    };

    Object.defineProperty(Array.prototype, "chunk", {
        value: function value(n) {
            var _this = this;

            // ACTUAL CODE FOR CHUNKING ARRAY:
            return Array.range(Math.ceil(this.length / n)).map(function (x, i) {
                return _this.slice(i * n, i * n + n);
            });
        }
    });
};

/**
 * Create/return multiple instances/evaluations of a passed class/function.
 * 
 * @mutator(@i, @args) will be executed at the end of each loop.
 */
function factory(fnOrClass, qty) {
    var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var mutator = arguments[3];

    var results = [];
    for (var i = 0; i < qty; i++) {
        if (typeof fnOrClass === "function") {
            results.push(fnOrClass.apply(undefined, _toConsumableArray(args)));
        } else {
            results.push(new (Function.prototype.bind.apply(fnOrClass, [null].concat(_toConsumableArray(args))))());
        }

        if (typeof mutator === "function") {
            args = mutator(i, args);
        }
    }

    if (results.length) {
        return results;
    }

    return results[0];
}

exports.default = {
    pipe: pipe,
    compose: compose,
    flatten: flatten,
    unflatten: unflatten,
    seedObject: seedObject,
    round: round,
    floor: floor,
    ceil: ceil,
    between: between,
    near: near,
    clamp: clamp,

    extendJavascript: extendJavascript,
    factory: factory
};