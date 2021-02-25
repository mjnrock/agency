"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Store = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Factory = Factory;
exports.TypedReducer = TypedReducer;

var _nodeFetch = require("node-fetch");

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _Observable2 = require("./Observable");

var _Observable3 = _interopRequireDefault(_Observable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = exports.Store = function (_Observable) {
    _inherits(Store, _Observable);

    function Store() {
        var _ret;

        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Store);

        var _this = _possibleConstructorReturn(this, (Store.__proto__ || Object.getPrototypeOf(Store)).call(this, false, { noWrap: true }));

        _this.__state = state;

        for (var _len = arguments.length, reducers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            reducers[_key - 1] = arguments[_key];
        }

        _this.__reducers = new Set(reducers);

        return _ret = new Proxy(_this, {
            get: function get(target, prop) {
                if (prop in target.__state) {
                    return target.__state[prop];
                }

                return target[prop];
            },
            set: function set(target, prop, value) {
                if (prop === "next") {
                    target.next = value;
                } else if (prop === "state" || prop[0] === "_" && prop[1] === "_") {
                    target[prop] = value;
                }

                return this;
            }
        }), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Store, [{
        key: "addReducer",
        value: function addReducer() {
            for (var _len2 = arguments.length, reducers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                reducers[_key2] = arguments[_key2];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = reducers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var reducer = _step.value;

                    this.__reducers.add(reducer);
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
        key: "removeReducer",
        value: function removeReducer() {
            for (var _len3 = arguments.length, reducers = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                reducers[_key3] = arguments[_key3];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = reducers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var reducer = _step2.value;

                    this.__reducers.delete(reducer);
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

            return this;
        }
    }, {
        key: "dispatch",
        value: function dispatch() {
            var state = void 0;

            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.__reducers.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var reducer = _step3.value;

                    state = reducer.apply(undefined, [state || this.__state].concat(args)) || state;
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

            this.__isProcessable = true;
            this.state = state;
            delete this.__isProcessable;

            return this;
        }
    }, {
        key: "fetchDispatch",
        value: async function fetchDispatch(url) {
            for (var _len5 = arguments.length, dispatchArgs = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
                dispatchArgs[_key5 - 2] = arguments[_key5];
            }

            var _this2 = this;

            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return (0, _nodeFetch2.default)(url, opts).then(function (resp) {
                return resp.json();
            }).then(function (data) {
                return _this2.dispatch.apply(_this2, dispatchArgs.concat([data]));
            }).catch(function (e) {
                return e;
            });
        }
    }, {
        key: "promiseDispatch",
        value: async function promiseDispatch(promise) {
            var _this3 = this;

            for (var _len6 = arguments.length, dispatchArgs = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                dispatchArgs[_key6 - 1] = arguments[_key6];
            }

            return Promise.resolve(promise).then(function () {
                for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                    args[_key7] = arguments[_key7];
                }

                return _this3.dispatch.apply(_this3, dispatchArgs.concat(args));
            }).catch(function (e) {
                return e;
            });
        }
    }, {
        key: "toData",
        value: function toData() {
            var obj = {};
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = Object.entries(this.__state)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _step4$value = _slicedToArray(_step4.value, 2),
                        key = _step4$value[0],
                        value = _step4$value[1];

                    if (key[0] !== "_" && key[1] !== "_") {
                        if (value instanceof _Observable3.default) {
                            obj[key] = value.toData();
                        } else {
                            obj[key] = value;
                        }
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

            return obj;
        }
    }, {
        key: "state",
        get: function get() {
            return this.toData();
        },
        set: function set(state) {
            if (this.__isProcessable !== true) {
                return this;
            }

            if ((typeof state === "undefined" ? "undefined" : _typeof(state)) === "object") {
                var oldState = this.toData();
                this.__state = state;

                this.next("state", { current: this.state, previous: oldState });
            }

            return this;
        }
    }]);

    return Store;
}(_Observable3.default);

;

//? Use the .Factory method to create a <Store> with default state
function Factory() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    for (var _len8 = arguments.length, reducers = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
        reducers[_key8 - 1] = arguments[_key8];
    }

    return new (Function.prototype.bind.apply(Store, [null].concat([state], reducers)))();
};

/**
 * The type variable should be the first argument passed to .process
 */
function TypedReducer(type, fn) {
    return function (state, t) {
        for (var _len9 = arguments.length, args = Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
            args[_key9 - 2] = arguments[_key9];
        }

        if (type === t) {
            return fn.apply(undefined, [state].concat(args));
        } else if ((typeof t === "undefined" ? "undefined" : _typeof(t)) === "object" && t.type === type) {
            // "message object" that contains "type" key
            return fn.apply(undefined, [state, t].concat(args));
        }
    };
};

Store.Factory = Factory;
Store.TypedReducer = TypedReducer;

exports.default = Store;