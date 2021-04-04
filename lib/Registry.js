"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Registry = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

var _AgencyBase2 = require("./AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Registry = exports.Registry = function (_AgencyBase) {
    _inherits(Registry, _AgencyBase);

    function Registry() {
        var _ret;

        var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, Registry);

        var _this = _possibleConstructorReturn(this, (Registry.__proto__ || Object.getPrototypeOf(Registry)).call(this));

        _this._state = {};

        var proxy = new Proxy(_this, {
            get: function get(target, prop) {
                if (prop in target) {
                    return Reflect.get(target, prop);
                }

                return Reflect.get(target._state, prop);
            },
            set: function set(target, prop, value) {
                if ((0, _uuid.validate)(prop)) {
                    // assignment
                    return Reflect.defineProperty(target, prop, {
                        value: value,
                        configurable: true,
                        writable: true,
                        enumerable: true
                    });
                } else if ((0, _uuid.validate)(value)) {
                    // sic | synonym assignment
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

                return Reflect.set(target._state, prop, value);
            }
        });

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

    _createClass(Registry, [{
        key: Symbol.iterator,


        /**
         * ! [Special Case]:    <Registry> iteration is VALUES ONLY, because the UUID is internal.
         */
        value: function value() {
            var _this2 = this;

            var index = -1;
            var data = Object.keys(this).reduce(function (a, k) {
                return k !== "state" ? [].concat(_toConsumableArray(a), [_this2[k]]) : a;
            }, []);

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

            var uuid = (entry || {}).__id || (entry || {}).id || (0, _uuid.v4)();

            this[uuid] = entry;

            for (var _len = arguments.length, synonyms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                synonyms[_key - 1] = arguments[_key];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = synonyms[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var synonym = _step2.value;

                    this[synonym] = uuid;
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

            return uuid;
        }
    }, {
        key: "unregister",
        value: function unregister(lookup) {
            var result = this[(lookup || {}).__id || (lookup || {}).id || lookup];
            var keys = [];

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = Reflect.ownKeys(this)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var key = _step3.value;

                    var entry = this[key];

                    if (entry === result || entry === lookup) {
                        keys.push(key);
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

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = keys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _key2 = _step4.value;

                    Reflect.deleteProperty(this, _key2);
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

            return keys;
        }
    }, {
        key: "state",
        get: function get() {
            return this._state;
        }
    }, {
        key: "synonyms",
        get: function get() {
            var _this3 = this;

            return Reflect.ownKeys(this).reduce(function (a, k) {
                if ((k[0] !== "_" || k[0] === "_" && k[1] !== "_") && (0, _uuid.validate)(_this3[k])) {
                    return [].concat(_toConsumableArray(a), [k]);
                }

                return a;
            }, []);
        }
    }, {
        key: "records",
        get: function get() {
            var obj = {};
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = Reflect.ownKeys(this)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var key = _step5.value;

                    if (key[0] !== "_" || key[0] === "_" && key[1] !== "_") {
                        var entry = this[key];

                        if ((0, _uuid.validate)(entry)) {
                            obj[entry] = [].concat(_toConsumableArray((obj || [])[entry] || []), [key]);
                        } else if ((0, _uuid.validate)(key)) {
                            obj[key] = [].concat(_toConsumableArray((obj || [])[key] || []), [entry]);
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
    }]);

    return Registry;
}(_AgencyBase3.default);

;

exports.default = Registry;