"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.$EventSender = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _uuid = require("uuid");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $EventSender = function $EventSender($super) {
    return function (_$super) {
        _inherits(_class, _$super);

        function _class() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var _ref$EventSender = _ref.EventSender,
                EventSender = _ref$EventSender === undefined ? {} : _ref$EventSender,
                rest = _objectWithoutProperties(_ref, ["EventSender"]);

            _classCallCheck(this, _class);

            var _this2 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, _extends({}, rest)));

            _this2.__subscribers = new Set();
            _this2.__relay = typeof EventSender.relay === "function" ? EventSender.relay : function () {
                return false;
            }; // A bubbling function that decides whether or not the event should get bubbled ALSO
            return _this2;
        }

        _createClass(_class, [{
            key: "addSubscriber",
            value: function addSubscriber() {
                for (var _len = arguments.length, subscribers = Array(_len), _key = 0; _key < _len; _key++) {
                    subscribers[_key] = arguments[_key];
                }

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = subscribers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var subscriber = _step.value;

                        if (typeof subscriber === "function") {
                            this.__subscribers.add(subscriber);
                        } else if (subscriber instanceof Emitter) {
                            this.__subscribers.add(subscriber);
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

                return this;
            }
        }, {
            key: "removeSubscriber",
            value: function removeSubscriber() {
                var bools = [];

                for (var _len2 = arguments.length, subscribers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    subscribers[_key2] = arguments[_key2];
                }

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = subscribers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var subscriber = _step2.value;

                        bools.push(this.__subscribers.delete(subscriber));
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

                if (bools.length === 1) {
                    return bools[0];
                }

                return bools;
            }
        }, {
            key: "addHandler",
            value: function addHandler(event) {
                for (var _len3 = arguments.length, fns = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    fns[_key3 - 1] = arguments[_key3];
                }

                if (!(this.__handlers[event] instanceof Set)) {
                    this.__handlers[event] = new Set();
                }

                if (Array.isArray(fns[0])) {
                    fns = fns[0];
                }

                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = fns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var fn = _step3.value;

                        if (typeof fn === "function") {
                            this.__handlers[event].add(fn);
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

                return this;
            }
        }, {
            key: "addHandlers",
            value: function addHandlers() {
                var addHandlerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = addHandlerArgs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var _step4$value = _toArray(_step4.value),
                            event = _step4$value[0],
                            fns = _step4$value.slice(1);

                        this.addHandler.apply(this, [event].concat(_toConsumableArray(fns)));
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

                return this;
            }
        }, {
            key: "removeHandler",
            value: function removeHandler(event) {
                for (var _len4 = arguments.length, fns = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                    fns[_key4 - 1] = arguments[_key4];
                }

                if (this.__handlers[event] instanceof Set) {
                    if (Array.isArray(fns[0])) {
                        fns = fns[0];
                    }

                    var bools = [];
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = fns[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var fn = _step5.value;

                            bools.push(this.__handlers[event].delete(fn));
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

                    if (bools.length === 1) {
                        return bools[0];
                    }

                    return bools;
                }

                return false;
            }
        }, {
            key: "removeHandlers",
            value: function removeHandlers() {
                var addHandlerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = addHandlerArgs[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var _step6$value = _toArray(_step6.value),
                            event = _step6$value[0],
                            fns = _step6$value.slice(1);

                        this.removeHandler.apply(this, [event].concat(_toConsumableArray(fns)));
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

                return this;
            }
        }, {
            key: "subscribers",
            get: function get() {
                return Object.entries(this.__subscribers);
            }
        }, {
            key: "$",
            get: function get() {
                var _this3 = this;

                var _this = function _this() {
                    return _this3;
                };

                return _extends({}, _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "$", this) || {}, {
                    emit: function emit(event) {
                        for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                            args[_key5 - 1] = arguments[_key5];
                        }

                        var payload = "provenance" in this ? this : {
                            id: (0, _uuid.v4)(),
                            type: event,
                            data: args,
                            emitter: _this(),
                            provenance: new Set()
                        };
                        payload.provenance.add(_this());

                        var _iteratorNormalCompletion7 = true;
                        var _didIteratorError7 = false;
                        var _iteratorError7 = undefined;

                        try {
                            for (var _iterator7 = _this().__subscribers[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                var subscriber = _step7.value;

                                if (typeof subscriber === "function") {
                                    subscriber.call.apply(subscriber, [payload].concat(args));
                                } else if (subscriber instanceof Emitter) {
                                    var _subscriber$$$_handle;

                                    (_subscriber$$$_handle = subscriber.$._handle).call.apply(_subscriber$$$_handle, [payload].concat(args));
                                }
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

                        return _this();
                    },
                    asyncEmit: async function asyncEmit(event) {
                        for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                            args[_key6 - 1] = arguments[_key6];
                        }

                        var payload = "provenance" in this ? this : {
                            id: (0, _uuid.v4)(),
                            type: event,
                            data: args,
                            emitter: _this(),
                            provenance: new Set()
                        };
                        payload.provenance.add(_this());

                        var _iteratorNormalCompletion8 = true;
                        var _didIteratorError8 = false;
                        var _iteratorError8 = undefined;

                        try {
                            for (var _iterator8 = _this().__subscribers[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                var subscriber = _step8.value;

                                if (typeof subscriber === "function") {
                                    subscriber.call.apply(subscriber, [payload].concat(args));
                                } else if (subscriber instanceof Emitter) {
                                    var _subscriber$$$_asyncH;

                                    (_subscriber$$$_asyncH = subscriber.$._asyncHandler).call.apply(_subscriber$$$_asyncH, [payload].concat(args));
                                }
                            }
                        } catch (err) {
                            _didIteratorError8 = true;
                            _iteratorError8 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                    _iterator8.return();
                                }
                            } finally {
                                if (_didIteratorError8) {
                                    throw _iteratorError8;
                                }
                            }
                        }

                        return _this();
                    }
                });
            }
        }, {
            key: "handlers",
            get: function get() {
                return Object.entries(this.__handlers);
            }
        }]);

        return _class;
    }($super);
};

exports.$EventSender = $EventSender;
exports.default = $EventSender;