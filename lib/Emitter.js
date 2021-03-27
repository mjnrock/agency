"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Emitter = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Watchable2 = require("./Watchable");

var _Watchable3 = _interopRequireDefault(_Watchable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Emitter = exports.Emitter = function (_Watchable) {
    _inherits(Emitter, _Watchable);

    function Emitter() {
        var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _ret;

        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var _ref$deep = _ref.deep,
            deep = _ref$deep === undefined ? false : _ref$deep,
            rest = _objectWithoutProperties(_ref, ["deep"]);

        _classCallCheck(this, Emitter);

        var _this2 = _possibleConstructorReturn(this, (Emitter.__proto__ || Object.getPrototypeOf(Emitter)).call(this, state, _extends({ deep: deep }, rest)));

        if (Array.isArray(events)) {
            _this2.__events = {};

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var event = _step.value;

                    _this2.$.handle(event);
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
        } else {
            _this2.__events = events;
        }

        return _ret = new Proxy(_this2, {
            get: function get(target, prop) {
                if (prop[0] === "$" && prop.length > 1) {
                    var key = prop.slice(1);

                    if (key in target.__events) {
                        return async function () {
                            var _target$__events;

                            return target.$.broadcast(key, (_target$__events = target.__events)[key].apply(_target$__events, arguments));
                        };
                    }

                    return function () {
                        return void 0;
                    };
                }

                return target[prop];
            }
        }), _possibleConstructorReturn(_this2, _ret);
    }

    _createClass(Emitter, [{
        key: "$",
        get: function get() {
            var _this = this;

            return _extends({}, _get(Emitter.prototype.__proto__ || Object.getPrototypeOf(Emitter.prototype), "$", this), {
                add: function add(event, emitter) {
                    if (typeof emitter === "function") {
                        _this.__events[event] = emitter;
                    }
                },
                remove: function remove(event) {
                    delete _this[event];
                },
                handle: function handle(event) {
                    _this.__events[event] = Emitter.Handler;
                },
                emit: async function emit(event) {
                    var fn = _this.__events[event];

                    if (typeof fn === "function") {
                        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                            args[_key - 1] = arguments[_key];
                        }

                        _this.$.broadcast(event, fn.apply(undefined, args));
                    }

                    return this;
                }
            });
        }
    }]);

    return Emitter;
}(_Watchable3.default);

Emitter.Handler = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    return args;
};

;

exports.default = Emitter;