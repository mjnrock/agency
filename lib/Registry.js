"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Registry = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _uuid = require("uuid");

var _Watchable2 = require("./Watchable");

var _Watchable3 = _interopRequireDefault(_Watchable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Registry = exports.Registry = function (_Watchable) {
    _inherits(Registry, _Watchable);

    function Registry() {
        var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _ret;

        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref$deep = _ref.deep,
            deep = _ref$deep === undefined ? true : _ref$deep,
            nestedProps = _ref.nestedProps;

        _classCallCheck(this, Registry);

        var _this2 = _possibleConstructorReturn(this, (Registry.__proto__ || Object.getPrototypeOf(Registry)).call(this, state, { deep: deep, nestedProps: nestedProps }));

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {

            for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var entry = _step.value;

                if (Array.isArray(entry)) {
                    _this2.register.apply(_this2, _toConsumableArray(entry));
                } else {
                    _this2.register(entry);
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

        var proxy = new Proxy(_this2, {
            get: function get(target, prop) {
                if (!(0, _uuid.validate)(prop) && (0, _uuid.validate)(target[prop])) {
                    // prop is NOT a uuid AND target[ prop ] IS a uuid --> prop is a synonym
                    var entry = target[target[prop]];

                    if (entry !== void 0) {
                        return entry;
                    }
                }

                return Reflect.get(target, prop);
            },
            set: function set(target, prop, value) {
                if ((0, _uuid.validate)(prop)) {
                    // assignment
                    // target[ prop ] = value;
                    return Reflect.set(target, prop, value);
                } else if ((0, _uuid.validate)(value)) {
                    // sic | synonym assignment
                    return Reflect.defineProperty(target, prop, {
                        configurable: true,
                        get: function get() {
                            return Reflect.get(target, value); // sic
                        },
                        set: function set(v) {
                            return Reflect.set(target, prop, value);
                        }
                    });
                    // return Reflect.set(target, prop, value);
                }

                return target;
            }
        });

        return _ret = proxy, _possibleConstructorReturn(_this2, _ret);
    }

    /**
     * ! [Special Case]:    <Registry> iteration is VALUES ONLY, because the UUID is internal.
     */


    _createClass(Registry, [{
        key: Symbol.iterator,
        value: function value() {
            var index = -1;
            var data = Object.values(this);

            return {
                next: function next() {
                    return { value: data[++index], done: !(index in data) };
                }
            };
        }
    }, {
        key: "$",
        get: function get() {
            var _this = this;
            var _broadcast = _get(Registry.prototype.__proto__ || Object.getPrototypeOf(Registry.prototype), "$", this).broadcast;
            var _ownKeys = _get(Registry.prototype.__proto__ || Object.getPrototypeOf(Registry.prototype), "$", this).ownKeys;

            return _extends({}, _get(Registry.prototype.__proto__ || Object.getPrototypeOf(Registry.prototype), "$", this), {
                broadcast: async function broadcast(prop, value) {
                    if ((0, _uuid.validate)(prop.substring(0, 36))) {
                        prop = prop.slice(37);
                    }

                    _broadcast.call("emitter" in this ? this : _this.$.proxy, prop, value);

                    return _this;
                },


                get synonyms() {
                    return _ownKeys.reduce(function (a, k) {
                        if ((k[0] !== "_" || k[0] === "_" && k[1] !== "_") && (0, _uuid.validate)(_this[k])) {
                            return [].concat(_toConsumableArray(a), [k]);
                        }

                        return a;
                    }, []);
                },
                get records() {
                    var obj = {};
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = _ownKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var key = _step2.value;

                            if (key[0] !== "_" || key[0] === "_" && key[1] !== "_") {
                                var entry = _this[key];

                                if ((0, _uuid.validate)(entry)) {
                                    obj[entry] = [].concat(_toConsumableArray((obj || [])[entry] || []), [key]);
                                } else if ((0, _uuid.validate)(key)) {
                                    obj[key] = [].concat(_toConsumableArray((obj || [])[key] || []), [entry]);
                                }
                            }
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

                    return obj;
                },

                register: function register(entry) {
                    //  Prevent anything with an establish "id" from registering multiple times, as it's already an Object and addressed
                    if (_this[(entry || {}).__id] !== void 0) {
                        return false;
                    }

                    var uuid = (entry || {}).__id || (0, _uuid.v4)();

                    _this[uuid] = entry;

                    for (var _len = arguments.length, synonyms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        synonyms[_key - 1] = arguments[_key];
                    }

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = synonyms[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var synonym = _step3.value;

                            _this[synonym] = uuid;
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

                    return uuid;
                },
                unregister: function unregister(lookup) {
                    var result = _this[lookup];
                    var keys = [];

                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = _ownKeys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var key = _step4.value;

                            var entry = _this[key];

                            if (entry === result || entry === lookup) {
                                keys.push(key);
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

                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = keys[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var _key2 = _step5.value;

                            Reflect.deleteProperty(_this, _key2);
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

                    return keys;
                }
            });
        }
    }]);

    return Registry;
}(_Watchable3.default);

;

exports.default = Registry;