"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $EventReceiver = function $EventReceiver($super) {
    return function (_$super) {
        _inherits(_class, _$super);

        function _class() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var _ref$EventReceiver = _ref.EventReceiver,
                EventReceiver = _ref$EventReceiver === undefined ? {} : _ref$EventReceiver,
                rest = _objectWithoutProperties(_ref, ["EventReceiver"]);

            _classCallCheck(this, _class);

            var _this2 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, _extends({}, rest)));

            _this2.__filter = typeof EventReceiver.filter === "function" ? EventReceiver.filter : function () {
                return true;
            }; // Universal filter that executed immediately in .handle to determine if should proceed
            _this2.__handlers = {
                "*": new Set()
            };

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(EventReceiver.handlers || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        event = _step$value[0],
                        fns = _step$value[1];

                    _this2.addHandler(event, fns);
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

            return _this2;
        }

        _createClass(_class, [{
            key: "addHandler",
            value: function addHandler(event) {
                for (var _len = arguments.length, fns = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    fns[_key - 1] = arguments[_key];
                }

                if (!(this.__handlers[event] instanceof Set)) {
                    this.__handlers[event] = new Set();
                }

                if (Array.isArray(fns[0])) {
                    fns = fns[0];
                }

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = fns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var fn = _step2.value;

                        if (typeof fn === "function") {
                            this.__handlers[event].add(fn);
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

                return this;
            }
        }, {
            key: "addHandlers",
            value: function addHandlers() {
                var addHandlerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = addHandlerArgs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _step3$value = _toArray(_step3.value),
                            event = _step3$value[0],
                            fns = _step3$value.slice(1);

                        this.addHandler.apply(this, [event].concat(_toConsumableArray(fns)));
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
            key: "removeHandler",
            value: function removeHandler(event) {
                for (var _len2 = arguments.length, fns = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    fns[_key2 - 1] = arguments[_key2];
                }

                if (this.__handlers[event] instanceof Set) {
                    if (Array.isArray(fns[0])) {
                        fns = fns[0];
                    }

                    var bools = [];
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = fns[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var fn = _step4.value;

                            bools.push(this.__handlers[event].delete(fn));
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
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = addHandlerArgs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var _step5$value = _toArray(_step5.value),
                            event = _step5$value[0],
                            fns = _step5$value.slice(1);

                        this.removeHandler.apply(this, [event].concat(_toConsumableArray(fns)));
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

                return this;
            }
        }, {
            key: "$",
            get: function get() {
                var _this3 = this;

                var _this = function _this() {
                    return _this3;
                };

                return _extends({}, _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "$", this) || {}, {

                    /**
                     * This is an internal function, so you must bind a proper payload before using outside of its
                     *      normal, singular scope within the emit function.  It is only here to exploit "this" bindings.
                     */
                    _handle: function _handle() {
                        var payload = this;

                        if (payload.provenance.has(_this()) === false) {
                            var _this$__filter;

                            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                                args[_key3] = arguments[_key3];
                            }

                            if (typeof _this().__filter === "function" && (_this$__filter = _this().__filter).call.apply(_this$__filter, [payload].concat(args)) === true) {
                                var _this$__relay;

                                var receivers = _this().__handlers["*"] || [];
                                var _iteratorNormalCompletion6 = true;
                                var _didIteratorError6 = false;
                                var _iteratorError6 = undefined;

                                try {
                                    for (var _iterator6 = receivers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                        var receiver = _step6.value;

                                        if (typeof receiver === "function") {
                                            receiver.call.apply(receiver, [payload].concat(args));
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

                                var handlers = _this().__handlers[this.type] || [];
                                var _iteratorNormalCompletion7 = true;
                                var _didIteratorError7 = false;
                                var _iteratorError7 = undefined;

                                try {
                                    for (var _iterator7 = handlers[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                        var handler = _step7.value;

                                        if (typeof handler === "function") {
                                            handler.call.apply(handler, [payload].concat(args));
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

                                if (typeof _this().__relay === "function" && (_this$__relay = _this().__relay).call.apply(_this$__relay, [payload].concat(args)) === true) {
                                    var _this$$$emit;

                                    (_this$$$emit = _this().$.emit).call.apply(_this$$$emit, [payload, this.type].concat(args));
                                }
                            }

                            return true;
                        }

                        return false;
                    },
                    _asyncHandler: async function _asyncHandler() {
                        var payload = this;

                        if (payload.provenance.has(_this()) === false) {
                            var _this$__filter2;

                            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                                args[_key4] = arguments[_key4];
                            }

                            if (typeof _this().__filter === "function" && (_this$__filter2 = _this().__filter).call.apply(_this$__filter2, [payload].concat(args)) === true) {
                                var _this$__relay2;

                                var receivers = _this().__handlers["*"] || [];
                                var _iteratorNormalCompletion8 = true;
                                var _didIteratorError8 = false;
                                var _iteratorError8 = undefined;

                                try {
                                    for (var _iterator8 = receivers[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                        var receiver = _step8.value;

                                        if (typeof receiver === "function") {
                                            receiver.call.apply(receiver, [payload].concat(args));
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

                                var handlers = _this().__handlers[this.type] || [];
                                var _iteratorNormalCompletion9 = true;
                                var _didIteratorError9 = false;
                                var _iteratorError9 = undefined;

                                try {
                                    for (var _iterator9 = handlers[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                        var handler = _step9.value;

                                        if (typeof handler === "function") {
                                            handler.call.apply(handler, [payload].concat(args));
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError9 = true;
                                    _iteratorError9 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                            _iterator9.return();
                                        }
                                    } finally {
                                        if (_didIteratorError9) {
                                            throw _iteratorError9;
                                        }
                                    }
                                }

                                if (typeof _this().__relay === "function" && (_this$__relay2 = _this().__relay).call.apply(_this$__relay2, [payload].concat(args)) === true) {
                                    var _this$$$asyncEmit;

                                    (_this$$$asyncEmit = _this().$.asyncEmit).call.apply(_this$$$asyncEmit, [payload, this.type].concat(args));
                                }
                            }

                            return true;
                        }

                        return false;
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

exports.$EventReceiver = $EventReceiver;
exports.default = $EventReceiver;