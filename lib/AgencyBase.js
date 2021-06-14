"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AgencyBase = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AgencyBase = exports.AgencyBase = function () {
    _createClass(AgencyBase, null, [{
        key: "Register",
        value: function Register(object) {
            if ((typeof object === "undefined" ? "undefined" : _typeof(object)) === "object" && (0, _uuid.validate)(object.id)) {
                AgencyBase.Repository.set(object.id, object);

                return true;
            }

            return false;
        }
    }, {
        key: "Unregister",
        value: function Unregister(objectOrId) {
            if ((typeof objectOrId === "undefined" ? "undefined" : _typeof(objectOrId)) === "object") {
                return AgencyBase.Repository.delete(objectOrId.id);
            } else if ((0, _uuid.validate)(objectOrId)) {
                return AgencyBase.Repository.delete(objectOrId);
            }

            return false;
        }
    }]);

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

                if (prop[0] === "_" || (Object.getOwnPropertyDescriptor(target, prop) || {}).set) {
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

        //FIXME	WeakMap vs. Map and cleanup
        // AgencyBase.Register(proxy);

        return proxy;
    }

    _createClass(AgencyBase, [{
        key: "__deconstructor",
        value: function __deconstructor() {
            AgencyBase.Unregister(this);
        }
    }, {
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
        },
        set: function set(id) {
            if ((0, _uuid.validate)(id)) {
                this.__id = id;
            }

            return this;
        }
    }, {
        key: "_keys",
        get: function get() {
            return Reflect.ownKeys(this);
        }
    }, {
        key: "_values",
        get: function get() {
            var _this = this;

            return Reflect.ownKeys(this).map(function (key) {
                return _this[key];
            });
        }
    }, {
        key: "_entries",
        get: function get() {
            var _this2 = this;

            return Reflect.ownKeys(this).map(function (key) {
                return [key, _this2[key]];
            });
        }
    }]);

    return AgencyBase;
}();

AgencyBase.Repository = new Map();
;

exports.default = AgencyBase;