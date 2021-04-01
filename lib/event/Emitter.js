"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Emitter = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Factory = Factory;

var _uuid = require("uuid");

var _AgencyBase2 = require("./../AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Emitter = exports.Emitter = function (_AgencyBase) {
    _inherits(Emitter, _AgencyBase);

    function Emitter() {
        var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            relay = _ref.relay,
            filter = _ref.filter,
            _ref$config = _ref.config,
            config = _ref$config === undefined ? {} : _ref$config;

        _classCallCheck(this, Emitter);

        var _this2 = _possibleConstructorReturn(this, (Emitter.__proto__ || Object.getPrototypeOf(Emitter)).call(this));

        _this2.__config = _extends({
            shouldHandleEmissions: true
        }, config);

        //#region RECEIVING
        _this2.__filter = filter || function () {
            return true;
        }; // Universal filter that executed immediately in .handle to determine if should proceed
        _this2.__handlers = {
            "*": new Set()
        };
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.entries(handlers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _step$value = _slicedToArray(_step.value, 2),
                    event = _step$value[0],
                    fns = _step$value[1];

                _this2.addHandler(event, fns);
            }
            //#endregion RECEIVING

            //#region SENDING
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

        _this2.__subscribers = new Set();
        _this2.__relay = relay || function () {
            return false;
        }; // A bubbling function that decides whether or not the event should get bubbled ALSO        
        //#endregion SENDING
        return _this2;
    }

    /**
     * Allow the <Emitter> to be used as a "subscription iterator" for <Emitter> only!
     */


    _createClass(Emitter, [{
        key: Symbol.iterator,
        value: function value() {
            var index = -1;
            var data = [].concat(_toConsumableArray(this.__subscribers)).filter(function (s) {
                return s instanceof Emitter;
            });

            return {
                next: function next() {
                    return { value: data[++index], done: !(index in data) };
                }
            };
        }

        //#region SENDING

    }, {
        key: "addSubscriber",
        value: function addSubscriber() {
            for (var _len = arguments.length, subscribers = Array(_len), _key = 0; _key < _len; _key++) {
                subscribers[_key] = arguments[_key];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = subscribers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var subscriber = _step2.value;

                    if (typeof subscriber === "function") {
                        this.__subscribers.add(subscriber);
                    } else if (subscriber instanceof Emitter) {
                        this.__subscribers.add(subscriber);
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
        key: "removeSubscriber",
        value: function removeSubscriber() {
            var bools = [];

            for (var _len2 = arguments.length, subscribers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                subscribers[_key2] = arguments[_key2];
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = subscribers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var subscriber = _step3.value;

                    bools.push(this.__subscribers.delete(subscriber));
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

            if (bools.length === 1) {
                return bools[0];
            }

            return bools;
        }
        //#endregion SENDING

        //#region RECEIVING

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

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = fns[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var fn = _step4.value;

                    if (typeof fn === "function") {
                        this.__handlers[event].add(fn);
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
        //#endregion RECEIVING

    }, {
        key: "subscribers",
        get: function get() {
            return Object.entries(this.__subscribers);
        }
    }, {
        key: "handlers",
        get: function get() {
            return Object.entries(this.__handlers);
        }
    }, {
        key: "$",
        get: function get() {
            var _this = this;

            return {
                emit: async function emit(event) {
                    for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                        args[_key5 - 1] = arguments[_key5];
                    }

                    var payload = "provenance" in this ? this : {
                        id: (0, _uuid.v4)(),
                        type: event,
                        data: args,
                        emitter: _this,
                        provenance: new Set()
                    };

                    if (_this.__config.shouldHandleEmissions === true) {
                        var handlers = _this.__handlers[payload.type] || [];
                        var _iteratorNormalCompletion6 = true;
                        var _didIteratorError6 = false;
                        var _iteratorError6 = undefined;

                        try {
                            for (var _iterator6 = handlers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                var handler = _step6.value;

                                if (typeof handler === "function") {
                                    handler.call.apply(handler, [payload].concat(args));
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
                    }

                    payload.provenance.add(_this);

                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = _this.__subscribers[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
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

                    return _this;
                },

                /**
                 * This is an internal function, so you must bind a proper payload before using outside of its
                 *      normal, singular scope within the emit function.  It is only here to exploit "this" bindings.
                 */
                _handle: async function _handle() {
                    var payload = this;

                    if (payload.provenance.has(_this) === false) {
                        var _this$__filter;

                        for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                            args[_key6] = arguments[_key6];
                        }

                        if (typeof _this.__filter === "function" && (_this$__filter = _this.__filter).call.apply(_this$__filter, [payload].concat(args)) === true) {
                            var _this$__relay;

                            var receivers = _this.__handlers["*"] || [];
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

                            var handlers = _this.__handlers[this.type] || [];
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

                            if (typeof _this.__relay === "function" && (_this$__relay = _this.__relay).call.apply(_this$__relay, [payload].concat(args)) === true) {
                                var _this$$$emit;

                                (_this$$$emit = _this.$.emit).call.apply(_this$$$emit, [payload, this.type].concat(args));
                            }
                        }

                        return true;
                    }

                    return false;
                }
            };
        }
    }]);

    return Emitter;
}(_AgencyBase3.default);

;

async function Factory() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$amount = _ref2.amount,
        amount = _ref2$amount === undefined ? 1 : _ref2$amount,
        argsFn = _ref2.argsFn,
        each = _ref2.each;

    var emitters = [];
    for (var i = 0; i < amount; i++) {
        var emitter = void 0;
        if (typeof argsFn === "function") {
            emitter = new (Function.prototype.bind.apply(Emitter, [null].concat(_toConsumableArray(argsFn(i)))))();
        } else {
            emitter = new Emitter();
        }

        emitters.push(emitter);

        if (typeof each === "function") {
            each(emitter, i);
        }
    }

    return emitters;
};

Emitter.Factory = Factory;

exports.default = Emitter;