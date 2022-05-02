"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Bitwise = exports.Bitwise = {
    add: function add(base) {
        for (var _len = arguments.length, flags = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            flags[_key - 1] = arguments[_key];
        }

        flags.forEach(function (flag) {
            base |= flag;
        });

        return base;
    },
    remove: function remove(base) {
        for (var _len2 = arguments.length, flags = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            flags[_key2 - 1] = arguments[_key2];
        }

        flags.forEach(function (flag) {
            base &= ~flag;
        });

        return base;
    },
    has: function has(base) {
        var result = true;

        for (var _len3 = arguments.length, flags = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            flags[_key3 - 1] = arguments[_key3];
        }

        flags.forEach(function (flag) {
            result = result && !!(base & flag);
        });

        return result;
    }
};

exports.default = Bitwise;