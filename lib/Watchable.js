"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Watchable = exports.wrapNested = exports.ProxyPrototype = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.Factory = Factory;

var _uuid = require("uuid");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProxyPrototype = exports.ProxyPrototype = function ProxyPrototype() {
    _classCallCheck(this, ProxyPrototype);
};

var wrapNested = exports.wrapNested = function wrapNested(root, prop, input) {
    if (input instanceof ProxyPrototype) {
        return input;
    } else if (input instanceof Watchable) {
        input.$.subscribe(function (p, v) {
            return root.$.emit(prop + "." + p, v);
        });

        return input;
    }

    var proxy = new Proxy(input, {
        getPrototypeOf: function getPrototypeOf(t) {
            return ProxyPrototype.prototype;
        },
        get: function get(t, p) {
            return t[p];
        },
        set: function set(t, p, v) {
            if (p.startsWith("_")) {
                // Don't emit any _Private/__Internal variables
                t[p] = v;

                return t;
            }

            if ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
                var ob = wrapNested(root, prop + "." + p, v);

                t[p] = ob;
            } else {
                t[p] = v;
            }

            if (!(Array.isArray(input) && p in Array.prototype)) {
                // Don't emit native <Array> keys (i.e. .push returns .length)
                root.$.emit(prop + "." + p, v);
            }

            return t;
        }
    });

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.entries(input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                proxy[key] = wrapNested(root, prop + "." + key, value);
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

    return proxy;
};

var Watchable = exports.Watchable = function () {
    function Watchable() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$deep = _ref.deep,
            deep = _ref$deep === undefined ? true : _ref$deep;

        _classCallCheck(this, Watchable);

        this.__id = (0, _uuid.v4)();

        this.__subscribers = new Map();

        var _this = new Proxy(this, {
            get: function get(target, prop) {
                return target[prop];
            },
            set: function set(target, prop, value) {
                if (target[prop] === value || prop === "$") {
                    return target;
                }

                if (prop.startsWith("_") || (Object.getOwnPropertyDescriptor(target, prop) || {}).set) {
                    // Don't emit any _Private/__Internal variables
                    target[prop] = value;

                    return target;
                }

                if (deep && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                    target[prop] = wrapNested(target, prop, value);

                    target.$.emit(prop, target[prop]);
                } else {
                    target[prop] = value;

                    target.$.emit(prop, value);
                }

                return target;
            }
        });

        if ((typeof state === "undefined" ? "undefined" : _typeof(state)) === "object") {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Object.entries(state)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _step2$value = _slicedToArray(_step2.value, 2),
                        key = _step2$value[0],
                        value = _step2$value[1];

                    _this[key] = value;
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
        }

        return _this;
    }

    // Method wrapper to easily prevent { key : value } collisions


    _createClass(Watchable, [{
        key: "$",
        get: function get() {
            var _this = this;

            return {
                get id() {
                    return _this.__id;
                },

                emit: async function emit(prop, value) {
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = _this.__subscribers.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var subscriber = _step3.value;

                            var payload = {
                                prop: prop,
                                value: value,
                                subject: _this,
                                emitter: _this,
                                subscriber: subscriber
                            };

                            if (typeof subscriber === "function") {
                                subscriber.call(payload, prop, value);
                            } else if (subscriber instanceof Watchable) {
                                subscriber.$.emit.call(payload, prop, value);
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

                    return _this;
                },
                purge: function purge() {
                    var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                    _this.__subscribers.clear();

                    if (deep) {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = Object.entries(_this)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var _step4$value = _slicedToArray(_step4.value, 2),
                                    key = _step4$value[0],
                                    value = _step4$value[1];

                                if (value instanceof Watchable) {
                                    value.$.purge(true);
                                }
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    }

                    return _this;
                },
                subscribe: function subscribe(input) {
                    if (typeof input === "function") {
                        var uuid = (0, _uuid.v4)();
                        _this.__subscribers.set(uuid, input);

                        return uuid;
                    } else if (input instanceof Watchable) {
                        _this.__subscribers.set(input.$.id, input);

                        return input.$.id;
                    }

                    return false;
                },
                unsubscribe: function unsubscribe(nextableOrFn) {
                    return _this.__subscribers.delete(nextableOrFn);
                },
                toData: function toData() {
                    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                        _ref2$includePrivateK = _ref2.includePrivateKeys,
                        includePrivateKeys = _ref2$includePrivateK === undefined ? false : _ref2$includePrivateK;

                    var obj = {};

                    if ("__arrayLength" in _this) {
                        var arr = [];
                        for (var i = 0; i < _this.__arrayLength; i++) {
                            var entry = _this[i];

                            if (entry instanceof Watchable) {
                                arr.push(entry.$.toData());
                            } else {
                                arr.push(entry);
                            }
                        }

                        return arr;
                    }

                    if (includePrivateKeys) {
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = Object.entries(_this)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var _step5$value = _slicedToArray(_step5.value, 2),
                                    key = _step5$value[0],
                                    value = _step5$value[1];

                                if (!key.startsWith("__")) {
                                    if (value instanceof Watchable) {
                                        obj[key] = value.$.toData();
                                    } else {
                                        obj[key] = value;
                                    }
                                }
                            }
                        } catch (err) {
                            _didIteratorError5 = true;
                            _iteratorError5 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }
                            } finally {
                                if (_didIteratorError5) {
                                    throw _iteratorError5;
                                }
                            }
                        }

                        return obj;
                    }

                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = Object.entries(_this)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var _step6$value = _slicedToArray(_step6.value, 2),
                                key = _step6$value[0],
                                value = _step6$value[1];

                            if (!key.startsWith("_")) {
                                if (value instanceof Watchable) {
                                    obj[key] = value.$.toData();
                                } else {
                                    obj[key] = value;
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError6 = true;
                        _iteratorError6 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                _iterator6.return();
                            }
                        } finally {
                            if (_didIteratorError6) {
                                throw _iteratorError6;
                            }
                        }
                    }

                    return obj;
                }
            };
        }
    }]);

    return Watchable;
}();

;

function Factory(state) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new Watchable(state, opts);
};

Watchable.Factory = Factory;

exports.default = Watchable;