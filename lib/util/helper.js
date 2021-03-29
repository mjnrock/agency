"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.seedObject = seedObject;
exports.round = round;
exports.clamp = clamp;
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
                var topkey = key.slice(0, key.indexOf("."));
                var subkey = key.slice(key.indexOf(".") + 1);

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

exports.default = {
    seedObject: seedObject,
    round: round,
    clamp: clamp
};