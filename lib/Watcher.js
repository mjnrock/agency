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
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, Watcher);

        var _this2 = _possibleConstructorReturn(this, (Watcher.__proto__ || Object.getPrototypeOf(Watcher)).call(this, state, opts));

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
        return _this2;
    }

    _createClass(Watcher, [{
        key: "$",
        get: function get() {
            var _this = this;

            return _extends({}, _get(Watcher.prototype.__proto__ || Object.getPrototypeOf(Watcher.prototype), "$", this), {
                emit: async function emit(prop, value) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = _this.__subscribers.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var subscriber = _step2.value;

                            /**
                             * @prop | The chain-prop from the original emission
                             * @value | The chain-prop's value from the original emission
                             * @subject | The original .emit <Watchable>
                             * @observer | The original subscriber (fn|Watcher) -- The original <Watcher> in a chain emission
                             * @emitter | The emitting <Watchable> -- The final <Watcher> in a chain emission
                             * @subscriber | The subscription fn|Watcher receiving the invocation
                             */
                            var payload = {
                                prop: prop,
                                value: value,
                                subject: this.subject || _this,
                                observer: this.observer || this.subscriber || subscriber,
                                emitter: _this,
                                subscriber: subscriber
                            };

                            if (typeof subscriber === "function") {
                                subscriber.call(payload, prop, value, payload.subject.$.id);
                            } else if (subscriber instanceof _Watchable3.default) {
                                subscriber.$.emit.call(payload, prop, value, payload.subject.$.id);
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

                    return _this;
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