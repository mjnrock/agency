"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.MaskedEnumerator = MaskedEnumerator;

var _Bitwise = require("./Bitwise");

var _Bitwise2 = _interopRequireDefault(_Bitwise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This adds "lookup" functions to an enumeration object
 */
function MaskedEnumerator() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var obj = _extends({}, items);

    obj.flagToName = function (flag) {
        for (var name in obj) {
            if (obj[name] === flag) {
                return name;
            }
        }

        return null;
    };
    obj.maskToNames = function (mask) {
        var names = [];

        for (var name in obj) {
            if (_Bitwise2.default.has(mask, obj[name])) {
                names.push(name);
            }
        }

        return names;
    };

    return Object.freeze(obj);
};

exports.default = MaskedEnumerator;