"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Emitter = exports.EmitterBase = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Factory = Factory;

var _$EventReceiver = require("./$EventReceiver");

var _$EventReceiver2 = _interopRequireDefault(_$EventReceiver);

var _$EventSender = require("./$EventSender");

var _$EventSender2 = _interopRequireDefault(_$EventSender);

var _AgencyBase = require("./../AgencyBase");

var _AgencyBase2 = _interopRequireDefault(_AgencyBase);

var _Network = require("./Network");

var _Network2 = _interopRequireDefault(_Network);

var _helper = require("./../util/helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EmitterBase = exports.EmitterBase = function EmitterBase() {
    for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
        mixins[_key] = arguments[_key];
    }

    return _helper.compose.apply(undefined, mixins.concat([_$EventReceiver2.default, _$EventSender2.default]))(_AgencyBase2.default);
};

var Emitter = exports.Emitter = function (_EmitterBase) {
    _inherits(Emitter, _EmitterBase);

    _createClass(Emitter, null, [{
        key: "$",
        get: function get() {
            if (!Emitter.Instance) {
                Emitter.Instance = new Emitter();
            }

            return Emitter.Instance;
        }
    }]);

    function Emitter() {
        var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            relay = _ref.relay,
            filter = _ref.filter,
            _ref$injectMiddleware = _ref.injectMiddleware,
            injectMiddleware = _ref$injectMiddleware === undefined ? true : _ref$injectMiddleware;

        _classCallCheck(this, Emitter);

        var _this = _possibleConstructorReturn(this, (Emitter.__proto__ || Object.getPrototypeOf(Emitter)).call(this, {
            EventReceiver: {
                filter: filter,
                handlers: handlers
            },
            EventSender: {
                relay: relay
            }
        }));

        if (injectMiddleware) {
            _Network2.default.Middleware(_this);
            _this.__deconstructor = function () {
                return _Network2.default.Cleanup(_this);
            };
        }
        return _this;
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
    }, {
        key: "is",
        value: function is(input) {
            return this === input || (typeof input === "string" || input instanceof String) && this.id === input || (typeof input === "undefined" ? "undefined" : _typeof(input)) === "object" && (this.id === input.id || this.id === input._id || this.id === input.__id);
        }
    }, {
        key: "__deconstructor",
        value: function __deconstructor() {}
    }]);

    return Emitter;
}(EmitterBase());

Emitter.Instance = new Emitter();
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