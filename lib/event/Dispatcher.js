"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Dispatcher = exports.$Dispatcher = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AgencyBase = require("../AgencyBase");

var _AgencyBase2 = _interopRequireDefault(_AgencyBase);

var _Network = require("./Network");

var _Network2 = _interopRequireDefault(_Network);

var _helper = require("../util/helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $Dispatcher = function $Dispatcher($super) {
    return function (_$super) {
        _inherits(_class, _$super);

        function _class() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var _ref$Dispatcher = _ref.Dispatcher,
                Dispatcher = _ref$Dispatcher === undefined ? {} : _ref$Dispatcher,
                rest = _objectWithoutProperties(_ref, ["Dispatcher"]);

            _classCallCheck(this, _class);

            // << this >> is trapped here, but is @target in the getters/setters --> initialize to set property descriptors from << AgencyBase >>
            var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, _extends({}, rest)));

            _this._subject = null;
            _this._network = null;
            _this._dispatch = null;
            _this._broadcast = null;

            _this.network = Dispatcher.network;
            _this.subject = Dispatcher.subject;
            _this.middleware = Dispatcher.middleware;

            if (Dispatcher.subject === true) {
                _this.subject = Dispatcher.network; //  sic
            }
            return _this;
        }

        /**
         * ? Convenience Method
         * Reassign the @network and @subject in one call
         */


        _createClass(_class, [{
            key: "reassign",
            value: function reassign(network, subject, middleware) {
                this.network = network;
                this.subject = subject;
                this.middleware = middleware;

                return this;
            }

            /**
             * The <Network> to use as the messaging system.
             */

        }, {
            key: "network",
            get: function get() {
                return this._network;
            },
            set: function set(network) {
                if (network instanceof _Network2.default) {
                    this._network = network;

                    this.dispatch = network.__bus.emit;
                    this.broadcast = network.broadcast;
                }
            }

            /**
             * The << subject >> allows a default emitter to
             *  be bound to the <Dispatcher> invocations.
             */

        }, {
            key: "subject",
            get: function get() {
                return this._subject;
            },
            set: function set(subject) {
                if (subject !== void 0) {
                    this._subject = subject;
                }
            }

            /**
             * The << middleware >> allows a default middleware to
             *  be bound to the <Dispatcher> invocations.
             */

        }, {
            key: "middleware",
            get: function get() {
                if (typeof this._middleware === "function") {
                    return this._middleware;
                }

                return function (network, subject, args) {
                    return args;
                };
            },
            set: function set(middleware) {
                if (typeof middleware === "function") {
                    this._middleware = middleware;
                }
            }

            /**
             * The dispatch methods allow for a message to be sent
             *  directly to << this.network >> via << .emit >>.  As such,
             *  routing is utilized.
             */

        }, {
            key: "dispatch",
            get: function get() {
                return this._dispatch;
            },
            set: function set(fn) {
                var _this2 = this;

                if (typeof fn === "function") {
                    this._dispatch = function () {
                        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        var params = _this2.middleware(_this2.network.__bus, _this2.subject, args) || args;

                        if (_this2.subject) {
                            fn.call.apply(fn, [_this2.network.__bus, _this2.subject].concat(_toConsumableArray(params)));
                        } else {
                            fn.call.apply(fn, [_this2.network.__bus].concat(_toConsumableArray(params)));
                        }
                    };
                }
            }

            /**
             * The broadcast methods allow for a message to be sent
             *  directly to each <Network> connection.  This, if used
             *  in a network hierarchy, can be used as a bubbler.  It
             *  will invoke the << .route >> function, ensuring that
             *  the (connected) <Network(s)> routing is utilized.
             */

        }, {
            key: "broadcast",
            get: function get() {
                return this._broadcast;
            },
            set: function set(fn) {
                var _this3 = this;

                if (typeof fn === "function") {
                    this._broadcast = function () {
                        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                            args[_key2] = arguments[_key2];
                        }

                        var params = _this3.middleware(_this3.network, _this3.subject, args) || args;

                        if (_this3.subject) {
                            fn.call.apply(fn, [_this3.network, _this3.subject].concat(_toConsumableArray(params)));
                        } else {
                            fn.call.apply(fn, [_this3.network].concat(_toConsumableArray(params)));
                        }
                    };
                }
            }
        }]);

        return _class;
    }($super);
};

/**
 * This class extracts the message invocation functions from <Network>
 *  and allows a @subject and @network to be bound, so that this class
 *  can act as a proxy or conduit to invoke that functionality.
 * 
 * If a @subject is present, then it will be injected as the first argument
 *  in a given function invocation.  All invocations will be given the
 *  <Network> as its << this >> binding.
 *
 *  << <Network> .emit | .broadcast | .sendToChannel >> are all exposed.
 */
exports.$Dispatcher = $Dispatcher;

var Dispatcher = exports.Dispatcher = function (_compose) {
    _inherits(Dispatcher, _compose);

    function Dispatcher(network, subject) {
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, Dispatcher);

        return _possibleConstructorReturn(this, (Dispatcher.__proto__ || Object.getPrototypeOf(Dispatcher)).call(this, _extends({
            Dispatcher: {
                network: network,
                subject: subject
            }
        }, opts)));
    }

    return Dispatcher;
}((0, _helper.compose)($Dispatcher)(_AgencyBase2.default));

exports.default = Dispatcher;