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

var _Dispatcher2 = require("../../event/Dispatcher");

var _Dispatcher3 = _interopRequireDefault(_Dispatcher2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
                port = _ref.port,
                _ref$opts = _ref.opts,
                opts = _ref$opts === undefined ? {} : _ref$opts;

            if (host && protocol && port) {
                this.connection = new _ws2.default(protocol + "://" + host + ":" + port, opts);
            } else {
                this.connection = new _ws2.default(url, opts);
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
            if (this.isOpen) {
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
        key: "isOpen",
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

    var _extends2;

    var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$packets = _ref2.packets,
        packets = _ref2$packets === undefined ? _Packets2.default.Json() : _ref2$packets;

    /**
     * The <BasicNetwork> is a fully-featured <Network> that comes preconfigured
     *  as a single-route (firstMatch), single-channel (named "default") network
     *  with real-time processing.
     */
    var network = new _Network.BasicNetwork(_extends((_extends2 = {}, _defineProperty(_extends2, Client.Signal.CLOSE, function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            code = _ref4[0],
            reason = _ref4[1];

        return console.warn("Client has disconnected [" + code + "] from", client.url);
    }), _defineProperty(_extends2, Client.Signal.ERROR, function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 1),
            error = _ref6[0];
    }), _defineProperty(_extends2, Client.Signal.MESSAGE, function (_ref7, _ref8) {
        var _ref9 = _slicedToArray(_ref7, 1),
            _ref9$ = _ref9[0],
            type = _ref9$.type,
            payload = _ref9$.payload;

        var client = _ref8.client;

        if (!Array.isArray(payload)) {
            payload = [payload];
        }

        console.log(type, payload);

        network.emit.apply(network, [client, type].concat(_toConsumableArray(payload)));
    }), _defineProperty(_extends2, Client.Signal.OPEN, function (_ref10, _ref11) {
        var _ref12 = _toArray(_ref10);

        var client = _ref11.client;

        console.warn("Client has connected to", client.url);

        client.send("bounce", Date.now());
    }), _defineProperty(_extends2, Client.Signal.PING, function (_ref13) {
        var _ref14 = _slicedToArray(_ref13, 1),
            data = _ref14[0];
    }), _defineProperty(_extends2, Client.Signal.PONG, function (_ref15) {
        var _ref16 = _slicedToArray(_ref15, 1),
            data = _ref16[0];
    }), _defineProperty(_extends2, Client.Signal.UNEXPECTED_RESPONSE, function (_ref17) {
        var _ref18 = _slicedToArray(_ref17, 2),
            req = _ref18[0],
            res = _ref18[1];
    }), _defineProperty(_extends2, Client.Signal.UPGRADE, function (_ref19) {
        var _ref20 = _slicedToArray(_ref19, 1),
            res = _ref20[0];
    }), _extends2), handlers));

    var client = new Client(network, _extends({}, packets, opts));

    /**
     * Load @client into the global store for use in handlers
     */
    network.storeGlobal({
        client: client,
        network: network
    });

    return client;
}

exports.default = Client;