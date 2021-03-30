"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AgencyBase = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AgencyBase = exports.AgencyBase = function () {
    function AgencyBase() {
        _classCallCheck(this, AgencyBase);

        var proxy = new Proxy(this, {
            get: function get(target, prop) {
                return Reflect.get(target, prop);
            },
            set: function set(target, prop, value) {
                if (target[prop] === value) {
                    return target;
                }

                if (value === null || prop[0] === "_" || (Object.getOwnPropertyDescriptor(target, prop) || {}).set) {
                    return Reflect.defineProperty(target, prop, {
                        value: value,
                        configurable: true,
                        writable: true,
                        enumerable: false
                    });
                }

                return Reflect.set(target, prop, value);
            }
        });

        proxy.__id = (0, _uuid.v4)();

        return proxy;
    }

    _createClass(AgencyBase, [{
        key: Symbol.iterator,
        value: function value() {
            var index = -1;
            var data = Object.entries(this);

            return {
                next: function next() {
                    return { value: data[++index], done: !(index in data) };
                }
            };
        }
    }, {
        key: "id",
        get: function get() {
            return this.__id;
        }
    }, {
        key: "ownKeys",
        get: function get() {
            return Reflect.ownKeys(this);
        }
    }]);

    return AgencyBase;
}();

;

exports.default = AgencyBase;