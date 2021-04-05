"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.pipe = pipe;
exports.compose = compose;
exports.seedObject = seedObject;
exports.round = round;
exports.clamp = clamp;
exports.extendJavascript = extendJavascript;
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

function seedObject() {
    var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
        return null;
    };

    var obj = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

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

    return obj;
};
// console.log(JSON.stringify(seedObject([ "world", "x", "y", "cat.dog", "cat.fish", "cat.fish.a" ], () => 1)));

/**
 * ! This may produce shallowly-unantipicated rounding calculations.  (cf. Math.round for nuances)
 */
function round(number) {
    var scalar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    return Math.round((number + Number.EPSILON) * scalar) / scalar; // Number.EPSILON ensures e.g. round(1.005, 100) --> 1.01
};
// console.log(round(15.5498, 10))  // e.v. 15.5, not 15.6

function clamp(value) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        min = _ref.min,
        max = _ref.max;

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
}

exports.default = {
    pipe: pipe,
    compose: compose,
    seedObject: seedObject,
    round: round,
    clamp: clamp,

    extendJavascript: extendJavascript
};