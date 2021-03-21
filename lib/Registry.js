"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Registry = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Factory = Factory;

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
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ret;

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$deep = _ref.deep,
            deep = _ref$deep === undefined ? false : _ref$deep;

        _classCallCheck(this, Registry);

        var _this = _possibleConstructorReturn(this, (Registry.__proto__ || Object.getPrototypeOf(Registry)).call(this, state, { deep: deep }));

        _this.__props = {
            size: 0
        };

        return _ret = new Proxy(_this, {
            get: function get(target, prop) {
                if (!(0, _uuid.validate)(prop) && (0, _uuid.validate)(target[prop])) {
                    // prop is NOT a uuid AND target[ prop ] IS a uuid --> prop is a synonym
                    var entry = target[target[prop]];

                    if (entry !== void 0) {
                        return entry;
                    }
                }

                return target[prop];
            },
            set: function set(target, prop, value) {
                if ((0, _uuid.validate)(prop) || (0, _uuid.validate)(value)) {
                    if (deep && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                        target[prop] = (0, _Watchable2.wrapNested)(target, prop, value);

                        target.$.emit(prop, target[prop]);
                    } else {
                        target[prop] = value;

                        target.$.emit(prop, value);
                    }

                    target.$.emit(prop, target[prop]);
                }

                return target;
            }
        }), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Registry, [{
        key: "register",
        value: function register(entry) {
            var uuid = (entry || {}).__id || (0, _uuid.v4)();

            this[uuid] = entry;
            this.__props.size += 1;

            for (var _len = arguments.length, synonyms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                synonyms[_key - 1] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = synonyms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var synonym = _step.value;

                    this[synonym] = uuid;
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

            return this;
        }
    }, {
        key: "unregister",
        value: function unregister(entryOrId) {
            var uuid = (0, _uuid.validate)(entryOrId) ? entryOrId : (entryOrId || {}).__id;

            if (uuid) {
                var entry = this[uuid];
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = Object.entries(this)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _step2$value = _slicedToArray(_step2.value, 2),
                            key = _step2$value[0],
                            value = _step2$value[1];

                        if (value === entry) {
                            // this[ synonym ] will return the this[ uuid ], because of the Proxy get trap, thus @entry
                            delete this[key];
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

                delete this[uuid];
                this.__props.size -= 1;
            }

            return this;
        }
    }, {
        key: "size",
        get: function get() {
            return this.__props.size;
        }
    }, {
        key: "entries",
        get: function get() {
            return Object.entries(this).reduce(function (a, _ref2) {
                var _ref3 = _slicedToArray(_ref2, 2),
                    k = _ref3[0],
                    v = _ref3[1];

                if ((0, _uuid.validate)(k)) {
                    return [].concat(_toConsumableArray(a), [[k, v]]);
                }

                return a;
            }, []);
        }
    }, {
        key: "values",
        get: function get() {
            return Object.entries(this).reduce(function (a, _ref4) {
                var _ref5 = _slicedToArray(_ref4, 2),
                    k = _ref5[0],
                    v = _ref5[1];

                if ((0, _uuid.validate)(k)) {
                    return [].concat(_toConsumableArray(a), [v]);
                }

                return a;
            }, []);
        }
    }, {
        key: "keys",
        get: function get() {
            return Object.keys(this).reduce(function (a, key) {
                if (key[0] !== "_" || key[0] === "_" && key[1] !== "_") {
                    return [].concat(_toConsumableArray(a), [key]);
                }

                return a;
            }, []);
        }
    }, {
        key: "ids",
        get: function get() {
            return Object.keys(this).reduce(function (a, v) {
                if ((0, _uuid.validate)(v)) {
                    return [].concat(_toConsumableArray(a), [v]);
                }

                return a;
            }, []);
        }
    }, {
        key: "synonyms",
        get: function get() {
            return Object.entries(this).reduce(function (a, _ref6) {
                var _ref7 = _slicedToArray(_ref6, 2),
                    k = _ref7[0],
                    v = _ref7[1];

                if ((k[0] !== "_" || k[0] === "_" && k[1] !== "_") && (0, _uuid.validate)(v)) {
                    return [].concat(_toConsumableArray(a), [k]);
                }

                return a;
            }, []);
        }
    }]);

    return Registry;
}(_Watchable3.default);

;

function Factory(deep) {
    return new Registry(deep);
};

Registry.Factory = Factory;

exports.default = Registry;