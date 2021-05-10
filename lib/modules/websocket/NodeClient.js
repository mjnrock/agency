"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Client = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.QuickSetup = QuickSetup;

var _ws = require("ws");

var _ws2 = _interopRequireDefault(_ws);

var _Packets = require("./Packets");

var _Packets2 = _interopRequireDefault(_Packets);

var _Network = require("../../event/Network");

var _Network2 = _interopRequireDefault(_Network);

var _Dispatcher2 = require("../../event/Dispatcher");

var _Dispatcher3 = _interopRequireDefault(_Dispatcher2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Client = exports.Client = function (_Dispatcher) {
    _inherits(Client, _Dispatcher);

    function Client(network) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Client);

        var _this = _possibleConstructorReturn(this, (Client.__proto__ || Object.getPrototypeOf(Client)).call(this, network));

        _this.subject = _this;

        if (typeof opts.packer === "function") {
            _this._packer = opts.packer;
        }
        if (typeof opts.unpacker === "function") {
            _this._unpacker = opts.unpacker;
        }

        if (opts.connect === true) {
            _this.connect(opts);
        }
        return _this;
    }

    _createClass(Client, [{
        key: "connect",
        value: function connect() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                url = _ref.url,
                host = _ref.host,
                _ref$protocol = _ref.protocol,
                protocol = _ref$protocol === undefined ? "http" : _ref$protocol,
                port = _ref.port;

            if (host && protocol && port) {
                this.connection = new _ws2.default(protocol + "://" + host + ":" + port);
            } else {
                this.connection = new _ws2.default(url);
            }

            this._bind(this.connection);

            return this;
        }
    }, {
        key: "_bind",
        value: function _bind(client) {
            var _this2 = this;

            client.on("close", function (code, reason) {
                return _this2.dispatch(Client.Signal.CLOSE, code, reason);
            });
            client.on("error", function (error) {
                return _this2.dispatch(Client.Signal.ERROR, error);
            });
            client.on("message", function (packet) {
                try {
                    var msg = void 0;
                    if (typeof _this2._unpacker === "function") {
                        msg = _this2._unpacker.call(_this2, packet);
                    } else {
                        msg = packet;
                    }

                    _this2.dispatch(Client.Signal.MESSAGE, msg);
                } catch (e) {
                    _this2.dispatch(Client.Signal.MESSAGE_ERROR, e, packet);
                }
            });
            client.on("open", function () {
                return _this2.dispatch(Client.Signal.OPEN);
            });
            client.on("ping", function (data) {
                return _this2.dispatch(Client.Signal.PING, data);
            });
            client.on("pong", function (data) {
                return _this2.dispatch(Client.Signal.PONG, data);
            });
            client.on("unexpected-response", function (req, res) {
                return _this2.dispatch(Client.Signal.UNEXPECTED_RESPONSE, req, res);
            });
            client.on("upgrade", function (res) {
                return _this2.dispatch(Client.Signal.UPGRADE, res);
            });
        }
    }, {
        key: "useNodeBuffer",
        value: function useNodeBuffer() {
            this.connection.binaryType = Client.BinaryType.NodeBuffer;

            return this;
        }
    }, {
        key: "useArrayBuffer",
        value: function useArrayBuffer() {
            this.connection.binaryType = Client.BinaryType.ArrayBuffer;

            return this;
        }
    }, {
        key: "useFragments",
        value: function useFragments() {
            this.connection.binaryType = Client.BinaryType.Fragments;

            return this;
        }
    }, {
        key: "send",
        value: function send(event) {
            if (this.isConnected) {
                var payload = void 0;

                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                if (typeof this._packer === "function") {
                    var _packer;

                    payload = (_packer = this._packer).call.apply(_packer, [this, event].concat(args));
                } else {
                    payload = [event].concat(args);
                }

                this.connection.send(payload);

                return true;
            }

            return false;
        }
    }, {
        key: "disconnect",
        value: function disconnect(code, reason) {
            var _this3 = this;

            var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            this.connection.close(code, reason);

            if (typeof timeout === "number" && timeout > 0) {
                setTimeout(function () {
                    try {
                        if (!_this3.isClosed) {
                            _this3.kill();
                        }
                    } catch (e) {
                        _this3.dispatch(Client.Signal.ERROR, e);
                    }
                }, timeout);
            }
        }
    }, {
        key: "kill",
        value: function kill() {
            this.connection.terminate();
        }
    }, {
        key: "url",
        get: function get() {
            return this.connection._url;
        }
    }, {
        key: "readiness",
        get: function get() {
            return this.connection.readyState;
        }
    }, {
        key: "isConnecting",
        get: function get() {
            return this.connection.readyState === _ws2.default.CONNECTING;
        }
    }, {
        key: "isConnected",
        get: function get() {
            return this.connection.readyState === _ws2.default.OPEN;
        }
    }, {
        key: "isClosing",
        get: function get() {
            return this.connection.readyState === _ws2.default.CLOSING;
        }
    }, {
        key: "isClosed",
        get: function get() {
            return this.connection.readyState === _ws2.default.CLOSED;
        }
    }]);

    return Client;
}(_Dispatcher3.default);

Client.Signal = {
    CLOSE: "WebSocketClient.Close",
    ERROR: "WebSocketClient.Error",
    MESSAGE: "WebSocketClient.Message",
    MESSAGE_ERROR: "WebSocketClient.MessageError",
    OPEN: "WebSocketClient.Open",
    PING: "WebSocketClient.Ping",
    PONG: "WebSocketClient.Pong",
    UNEXPECTED_RESPONSE: "WebSocketClient.UnexpectedResponse",
    UPGRADE: "WebSocketClient.Upgrade"
};
Client.BinaryType = {
    NodeBuffer: "nodebuffer",
    ArrayBuffer: "arraybuffer",
    Fragments: "fragments"
};
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
        packets = _ref2$packets === undefined ? _Packets2.default.Json() : _ref2$packets;

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
            handlers: _extends(_defineProperty({}, Client.Signal.MESSAGE, function (_ref3) {
                var data = _ref3.data;

                var _data = _slicedToArray(data, 1),
                    _data$ = _data[0],
                    type = _data$.type,
                    payload = _data$.payload;

                network.emit(type, payload);
            }), handlers)
        }
    });

    var client = new Client(network, _extends({}, packets, opts));

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

exports.default = Client;