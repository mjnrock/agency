"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BrowserClient = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.QuickSetup = QuickSetup;

var _Client2 = require("./Client");

var _Client3 = _interopRequireDefault(_Client2);

var _Packets = require("./Packets");

var _Packets2 = _interopRequireDefault(_Packets);

var _Network = require("../../event/Network");

var _Network2 = _interopRequireDefault(_Network);

var _Message = require("../../event/Message");

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BrowserClient = exports.BrowserClient = function (_Client) {
    _inherits(BrowserClient, _Client);

    function BrowserClient(network) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, BrowserClient);

        return _possibleConstructorReturn(this, (BrowserClient.__proto__ || Object.getPrototypeOf(BrowserClient)).call(this, network, opts));
    }

    _createClass(BrowserClient, [{
        key: "connect",
        value: function connect() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                url = _ref.url,
                host = _ref.host,
                _ref$protocol = _ref.protocol,
                protocol = _ref$protocol === undefined ? "http" : _ref$protocol,
                port = _ref.port;

            if (host && protocol && port) {
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
                return _this2.dispatch(_Client3.default.Signal.CLOSE, code, reason);
            });
            client.addEventListener("error", function (error) {
                return _this2.dispatch(_Client3.default.Signal.ERROR, error);
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

                    _this2.dispatch(_Client3.default.Signal.MESSAGE, msg);
                } catch (e) {
                    _this2.dispatch(_Client3.default.Signal.MESSAGE_ERROR, e, packet);
                }
            });
            client.addEventListener("open", function () {
                return _this2.dispatch(_Client3.default.Signal.OPEN);
            });
            client.addEventListener("ping", function (data) {
                return _this2.dispatch(_Client3.default.Signal.PING, data);
            });
            client.addEventListener("pong", function (data) {
                return _this2.dispatch(_Client3.default.Signal.PONG, data);
            });
            client.addEventListener("unexpected-response", function (req, res) {
                return _this2.dispatch(_Client3.default.Signal.UNEXPECTED_RESPONSE, req, res);
            });
            client.addEventListener("upgrade", function (res) {
                return _this2.dispatch(_Client3.default.Signal.UPGRADE, res);
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
    }]);

    return BrowserClient;
}(_Client3.default);

;

/**
 * Create a new <BasicNetwork> and a new <Client>, returning
 *  the newly created client.  The network can be accessed
 *  via << client.network >>.
 * 
 * The main convenience is that this setup will use the
 *  << Packets.JSON >> paradigm and setup the local
 *  message routing from packets received and unpackaged
 *  by the <Client>.  As such, the @handlers are those 
 *  that should receive the unpackaged packets.
 */
function QuickSetup() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$state = _ref2.state,
        state = _ref2$state === undefined ? {} : _ref2$state,
        _ref2$packets = _ref2.packets,
        packets = _ref2$packets === undefined ? _Packets2.default.BrowserJson() : _ref2$packets;

    /**
     * The <BasicNetwork> is a fully-featured <Network> that comes preconfigured
     *  as a single-route (firstMatch), single-channel (named "default") network
     *  with real-time processing.
     */
    var network = new _Network2.default(state, {
        $routes: [function (message) {
            return "default";
        }],
        default: {
            handlers: _extends(_defineProperty({}, _Client3.default.Signal.MESSAGE, function (_ref3, _ref4) {
                var data = _ref3.data;
                var network = _ref4.network;

                var _data = _slicedToArray(data, 1),
                    msg = _data[0];

                network.emit(msg);
            }), handlers)
        }
    });

    var client = new BrowserClient(network, _extends({}, packets, opts));

    network.alter({
        default: {
            globals: {
                client: client,
                network: network
            }
        }
    });

    return client;
}

exports.default = BrowserClient;