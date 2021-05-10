"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Registry = exports.$Registry = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

var _AgencyBase = require("./AgencyBase");

var _AgencyBase2 = _interopRequireDefault(_AgencyBase);

var _helper = require("./util/helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * NOTE:    Only *actual* entries will appear if you enumerate @this, and as such, the <$Registry>
 *          can be used as a value iterator.  Accessing the registry via a synonym will return the
 *          referential entry, if it exists.
 * 
 * Origin-Only Variables
 * ---------------------------------
 *  The variables below can only be set during instantiation of <$Registry>
 * 
 * @typed {?fn} | A set trap that must be true to proceed (e.g. instanceof ClassX)
 * @accessor {?fn} | A get trap that will accept the entry as its args --> fn(target[ prop ]) (e.g. factory methods)
 *  - @accessorArgs {?obj} | Include additional arguments to be passed to the @accessor into perpetuity
 */
var $Registry = function $Registry($super) {
    return function (_$super) {
        _inherits(_class, _$super);

        function _class() {
            var _ret;

            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var _ref$Registry = _ref.Registry,
                Registry = _ref$Registry === undefined ? {} : _ref$Registry,
                rest = _objectWithoutProperties(_ref, ["Registry"]);

            _classCallCheck(this, _class);

            var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, _extends({}, rest)));

            _this.__cache = new WeakMap(); // Used primarily for the reregistration of objects
            _this.__state = {};

            var proxy = new Proxy(_this, {
                get: function get(target, prop) {
                    if (typeof Registry.accessor === "function") {
                        if (prop in target) {
                            return Registry.accessor(Reflect.get(target, prop), Registry.accessorArgs || {});
                        }

                        return Registry.accessor(Reflect.get(target.__state, prop), Registry.accessorArgs || {});
                    }

                    if (prop in target) {
                        return Reflect.get(target, prop);
                    }

                    return Reflect.get(target.__state, prop);
                },
                set: function set(target, prop, value) {
                    if ((0, _uuid.validate)(prop)) {
                        // assignment                    
                        if (typeof Registry.typed === "function" && Registry.typed(prop, value, target[prop]) !== true) {
                            return target;
                        }

                        return Reflect.defineProperty(target, prop, {
                            value: value,
                            configurable: true,
                            writable: true,
                            enumerable: true
                        });
                    } else if ((0, _uuid.validate)(value)) {
                        // sic | synonym assignment
                        if (target[value] === void 0) {
                            // short circuit if a potential synonym doesn't have an anchor entry
                            return target;
                        }

                        return Reflect.defineProperty(target, prop, {
                            configurable: true,
                            enumerable: false,
                            get: function get() {
                                return Reflect.get(target, value); // sic
                            },
                            set: function set(v) {
                                return Reflect.set(target, prop, value);
                            }
                        });
                    }

                    return Reflect.set(target.__state, prop, value);
                }
            });

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (Registry.entries || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var entry = _step.value;

                    if (Array.isArray(entry)) {
                        proxy.register.apply(proxy, _toConsumableArray(entry));
                    } else {
                        proxy.register(entry);
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

            return _ret = proxy, _possibleConstructorReturn(_this, _ret);
        }

        _createClass(_class, [{
            key: "has",
            value: function has(entry, comparator) {
                if (typeof comparator === "function") {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = this[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var value = _step2.value;

                            if (comparator(entry, value) === true) {
                                return true;
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
                } else {
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var _value = _step3.value;

                            if (_value === entry) {
                                return true;
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
                }

                return false;
            }

            /**
             * ! [Special Case]:    <Registry> iteration is VALUES ONLY, because the UUID is internal and synonyms are virtualized.
             */

        }, {
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
            key: "register",
            value: function register(entry) {
                //  Prevent anything with an establish "id" from registering multiple times, as it's already an Object and addressed
                if (this[(entry || {}).__id || (entry || {}).id] !== void 0) {
                    return false;
                }

                var uuid = this.__cache.get(entry) || (entry || {}).__id || (entry || {}).id || (0, _uuid.v4)();

                this[uuid] = entry;

                //  Re-registration, reuse the previous id
                if ((typeof entry === "undefined" ? "undefined" : _typeof(entry)) === "object" && !this.__cache.has(entry)) {
                    this.__cache.set(entry, uuid);
                }

                for (var _len = arguments.length, synonyms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    synonyms[_key - 1] = arguments[_key];
                }

                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = synonyms[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var synonym = _step4.value;

                        this[synonym] = uuid;
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

                return uuid;
            }
        }, {
            key: "unregister",
            value: function unregister(lookup) {
                var result = this[(lookup || {}).__id || (lookup || {}).id || lookup];
                var keys = [];

                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = Reflect.ownKeys(this)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var key = _step5.value;

                        var entry = this[key];

                        if (entry === result || entry === lookup) {
                            keys.push(key);
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

                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = keys[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var _key2 = _step6.value;

                        Reflect.deleteProperty(this, _key2);
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

                return keys;
            }
        }, {
            key: "state",
            get: function get() {
                return this.__state;
            }
        }, {
            key: "size",
            get: function get() {
                return Object.keys(this).length;
            }
        }, {
            key: "synonyms",
            get: function get() {
                return Reflect.ownKeys(this).reduce(function (a, k) {
                    if ((k[0] !== "_" || k[0] === "_" && k[1] !== "_") && !(0, _uuid.validate)(k)) {
                        return [].concat(_toConsumableArray(a), [k]);
                    }

                    return a;
                }, []);
            }
        }]);

        return _class;
    }($super);
};

exports.$Registry = $Registry;

var Registry = exports.Registry = function (_compose) {
    _inherits(Registry, _compose);

    function Registry() {
        var registerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Registry);

        var _this2 = _possibleConstructorReturn(this, (Registry.__proto__ || Object.getPrototypeOf(Registry)).call(this, opts));

        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {

            for (var _iterator7 = registerArgs[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var args = _step7.value;

                if (!Array.isArray(args)) {
                    args = [args];
                }

                _this2.register.apply(_this2, _toConsumableArray(args));
            }
        } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                }
            } finally {
                if (_didIteratorError7) {
                    throw _iteratorError7;
                }
            }
        }

        return _this2;
    }

    /**
     * A convenience getter to easily access a default <Registry>
     *  when a multi-Registry setup is unnecessary.
     */


    _createClass(Registry, null, [{
        key: "Recreate",


        /**
         * Recreate the .Instances registry with optional seeding
         */
        value: function Recreate() {
            var registries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var createDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            Registry.Instances = new Registry({ Registry: { entries: registries } });

            if (createDefault) {
                Registry.Instances.register(new Registry(), "default");
            }
        }
    }, {
        key: "$",
        get: function get() {
            if (!(Registry.Instances || {}).default) {
                Registry.Recreate();
            }

            return Registry.Instances.default;
        }
    }, {
        key: "_",
        get: function get() {
            if (!Registry.Instances) {
                Registry.Recreate();
            }

            return Registry.Instances;
        }
    }]);

    return Registry;
}((0, _helper.compose)($Registry)(_AgencyBase2.default));

Registry.Instances = new Registry();
;

exports.default = Registry;