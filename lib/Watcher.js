"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Watcher = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.Factory = Factory;
exports.SubjectFactory = SubjectFactory;

var _Watchable2 = require("./Watchable");

var _Watchable3 = _interopRequireDefault(_Watchable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Watcher = exports.Watcher = function (_Watchable) {
    _inherits(Watcher, _Watchable);

    function Watcher() {
        var watchables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        _classCallCheck(this, Watcher);

        var _this2 = _possibleConstructorReturn(this, (Watcher.__proto__ || Object.getPrototypeOf(Watcher)).call(this, state, opts));

        _this2.__handlers = new Set(handlers);

        if (watchables instanceof _Watchable3.default) {
            watchables.$.subscribe(_this2);
        } else if (Array.isArray(watchables)) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = watchables[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var watchable = _step.value;

                    watchable.$.subscribe(_this2);
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
        }

        var _this = _this2;
        _this2.$.subscribe(function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _this.__handlers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var handler = _step2.value;

                    handler.call.apply(handler, [this].concat(args));
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
        });
        return _this2;
    }

    _createClass(Watcher, [{
        key: "$",
        get: function get() {
            var _this = this;

            return _extends({}, _get(Watcher.prototype.__proto__ || Object.getPrototypeOf(Watcher.prototype), "$", this), {
                watch: function watch() {
                    for (var _len2 = arguments.length, watchables = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        watchables[_key2] = arguments[_key2];
                    }

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = watchables[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var watchable = _step3.value;

                            if (watchable instanceof _Watchable3.default) {
                                watchable.$.subscribe(_this);
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
                unwatch: function unwatch() {
                    for (var _len3 = arguments.length, watchables = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        watchables[_key3] = arguments[_key3];
                    }

                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = watchables[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var watchable = _step4.value;

                            if (watchable instanceof _Watchable3.default) {
                                watchable.$.unsubscribe(_this);
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

                    return _this;
                },
                add: function add(handler) {
                    _this.__handlers.add(handler);

                    return this;
                },
                remove: function remove(handler) {
                    return _this.__handlers.delete(handler);
                },
                on: function on(prop, handler) {
                    var fn = function fn(p) {
                        if (p === prop) {
                            for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                                args[_key4 - 1] = arguments[_key4];
                            }

                            handler.call.apply(handler, [this].concat(args));
                        }
                    };

                    _this.__handlers.add(fn);

                    return fn;
                },
                like: function like(regex, handler) {
                    var fn = function fn(p) {
                        if (regex.test(p)) {
                            for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                                args[_key5 - 1] = arguments[_key5];
                            }

                            handler.call.apply(handler, [this, p].concat(args));
                        }
                    };

                    _this.__handlers.add(fn);

                    return fn;
                },
                when: function when(watchable, handler) {
                    var fn = function fn() {
                        if (this.subject === watchable) {
                            for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                                args[_key6] = arguments[_key6];
                            }

                            handler.call.apply(handler, [this].concat(args));
                        }
                    };

                    _this.__handlers.add(fn);

                    return fn;
                }
            });
        }
    }]);

    return Watcher;
}(_Watchable3.default);

;

function Factory(watchables, state) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return new Watcher(watchables, state, opts);
};
function SubjectFactory(state) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new Watcher(_Watchable3.default.Factory(state, opts));
};

Watcher.Factory = Factory;
Watcher.SubjectFactory = SubjectFactory;

exports.default = Watcher;