"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BrowserClient = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Client2 = require("./Client");

var _Client3 = _interopRequireDefault(_Client2);

var _Packets = require("./Packets");

var _Packets2 = _interopRequireDefault(_Packets);

var _Message = require("../../event/Message");

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BrowserClient = exports.BrowserClient = function (_Client) {
    _inherits(BrowserClient, _Client);

    function BrowserClient() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var alter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, BrowserClient);

        return _possibleConstructorReturn(this, (BrowserClient.__proto__ || Object.getPrototypeOf(BrowserClient)).call(this, state, alter, opts));
    }

    _createClass(BrowserClient, [{
        key: "connect",
        value: function connect() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                url = _ref.url,
                host = _ref.host,
                _ref$protocol = _ref.protocol,
                protocol = _ref$protocol === undefined ? "http" : _ref$protocol,
                port = _ref.port,
                ws = _ref.ws;

            if (ws instanceof WebSocket) {
                this.connection = ws;
            } else if (host && protocol && port) {
                this.connection = new WebSocket(protocol + "://" + host + ":" + port);
            } else {
                this.connection = new WebSocket(url);
            }

            this._bind(this.connection);

            return this;
        }
    }, {
        key: "_bind",
        value: function _bind(client) {
            var _this2 = this;

            client.addEventListener("close", function (code, reason) {
                return _this2.emit(_Client3.default.Signal.CLOSE, code, reason);
            });
            client.addEventListener("error", function (error) {
                return _this2.emit(_Client3.default.Signal.ERROR, error);
            });
            client.addEventListener("message", function (packet) {
                try {
                    var msg = void 0;
                    if (typeof _this2._unpacker === "function") {
                        var _unpacker$call = _this2._unpacker.call(_this2, packet),
                            type = _unpacker$call.type,
                            payload = _unpacker$call.payload;

                        msg = _Message2.default.Generate.apply(_Message2.default, [_this2, type].concat(_toConsumableArray(payload)));
                    } else {
                        msg = packet;
                    }

                    _this2.emit(_Client3.default.Signal.MESSAGE, msg);
                } catch (e) {
                    _this2.emit(_Client3.default.Signal.MESSAGE_ERROR, e, packet);
                }
            });
            client.addEventListener("open", function () {
                return _this2.emit(_Client3.default.Signal.OPEN);
            });
            client.addEventListener("ping", function (data) {
                return _this2.emit(_Client3.default.Signal.PING, data);
            });
            client.addEventListener("pong", function (data) {
                return _this2.emit(_Client3.default.Signal.PONG, data);
            });
            client.addEventListener("unexpected-response", function (req, res) {
                return _this2.emit(_Client3.default.Signal.UNEXPECTED_RESPONSE, req, res);
            });
            client.addEventListener("upgrade", function (res) {
                return _this2.emit(_Client3.default.Signal.UPGRADE, res);
            });
        }
    }, {
        key: "isConnecting",
        get: function get() {
            return this.connection.readyState === WebSocket.CONNECTING;
        }
    }, {
        key: "isConnected",
        get: function get() {
            return this.connection.readyState === WebSocket.OPEN;
        }
    }, {
        key: "isClosing",
        get: function get() {
            return this.connection.readyState === WebSocket.CLOSING;
        }
    }, {
        key: "isClosed",
        get: function get() {
            return this.connection.readyState === WebSocket.CLOSED;
        }
    }], [{
        key: "QuickSetup",
        value: function QuickSetup() {
            var wsOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref2$state = _ref2.state,
                state = _ref2$state === undefined ? {} : _ref2$state,
                _ref2$packets = _ref2.packets,
                packets = _ref2$packets === undefined ? _Packets2.default.BrowserJson() : _ref2$packets,
                broadcastMessages = _ref2.broadcastMessages;

            return _get(BrowserClient.__proto__ || Object.getPrototypeOf(BrowserClient), "QuickSetup", this).call(this, wsOpts, handlers, { state: state, packets: packets, clientClass: BrowserClient, broadcastMessages: broadcastMessages });
        }
    }]);

    return BrowserClient;
}(_Client3.default);

;

exports.default = BrowserClient;