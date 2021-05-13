"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QuickSetup = exports.Client = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isomorphicWs = require("isomorphic-ws");

var _isomorphicWs2 = _interopRequireDefault(_isomorphicWs);

var _Packets = require("./Packets");

var _Packets2 = _interopRequireDefault(_Packets);

var _Network2 = require("../../event/Network");

var _Network3 = _interopRequireDefault(_Network2);

var _Message = require("../../event/Message");

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Client = exports.Client = function (_Network) {
    _inherits(Client, _Network);

    function Client() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var alter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, Client);

        var _this = _possibleConstructorReturn(this, (Client.__proto__ || Object.getPrototypeOf(Client)).call(this, state, alter));

        _this.middleware = {
            pack: opts.pack,
            unpack: opts.unpack
        };

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
                ws = _ref.ws;

            if (ws instanceof _isomorphicWs2.default) {
                this.connection = ws;
            } else if (host && protocol && port) {
                this.connection = new _isomorphicWs2.default(protocol + "://" + host + ":" + port);
            } else {
                this.connection = new _isomorphicWs2.default(url);
            }

            this._bind(this.connection);

            return this;
        }
    }, {
        key: "_bind",
        value: function _bind(client) {
            var _this2 = this;

            client.addEventListener("close", function (code, reason) {
                return _this2.emit(Client.Signal.CLOSE, code, reason);
            });
            client.addEventListener("error", function (error) {
                return _this2.emit(Client.Signal.ERROR, error);
            });
            client.addEventListener("message", function (packet) {
                try {
                    var msg = void 0;
                    if (typeof _this2.middleware.unpack === "function") {
                        var _middleware$unpack$ca = _this2.middleware.unpack.call(_this2, packet),
                            type = _middleware$unpack$ca.type,
                            payload = _middleware$unpack$ca.payload;

                        msg = _Message2.default.Generate.apply(_Message2.default, [_this2, type].concat(_toConsumableArray(payload)));
                    } else {
                        msg = packet;
                    }

                    _this2.emit(Client.Signal.MESSAGE, msg);
                } catch (e) {
                    _this2.emit(Client.Signal.MESSAGE_ERROR, e, packet);
                }
            });
            client.addEventListener("open", function () {
                return _this2.emit(Client.Signal.OPEN);
            });
            client.addEventListener("ping", function (data) {
                return _this2.emit(Client.Signal.PING, data);
            });
            client.addEventListener("pong", function (data) {
                return _this2.emit(Client.Signal.PONG, data);
            });
            client.addEventListener("unexpected-response", function (req, res) {
                return _this2.emit(Client.Signal.UNEXPECTED_RESPONSE, req, res);
            });
            client.addEventListener("upgrade", function (res) {
                return _this2.emit(Client.Signal.UPGRADE, res);
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
        key: "sendToServer",
        value: function sendToServer(event) {
            if (this.isConnected) {
                var data = void 0;

                for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    payload[_key - 1] = arguments[_key];
                }

                if (typeof this.middleware.pack === "function") {
                    if (_Message2.default.Conforms(event)) {
                        var _middleware$pack;

                        data = (_middleware$pack = this.middleware.pack).call.apply(_middleware$pack, [this, event.type].concat(_toConsumableArray(event.data)));
                    } else {
                        var _middleware$pack2;

                        data = (_middleware$pack2 = this.middleware.pack).call.apply(_middleware$pack2, [this, event].concat(payload));
                    }
                } else {
                    data = [event, payload];
                }

                this.connection.send(data);

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
                        _this3.emit(Client.Signal.ERROR, e);
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
        key: "isConnecting",
        get: function get() {
            return this.connection.readyState === _isomorphicWs2.default.CONNECTING;
        }
    }, {
        key: "isConnected",
        get: function get() {
            return this.connection.readyState === _isomorphicWs2.default.OPEN;
        }
    }, {
        key: "isClosing",
        get: function get() {
            return this.connection.readyState === _isomorphicWs2.default.CLOSING;
        }
    }, {
        key: "isClosed",
        get: function get() {
            return this.connection.readyState === _isomorphicWs2.default.CLOSED;
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
    }], [{
        key: "QuickSetup",
        value: function QuickSetup() {
            var wsOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var _extends2;

            var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref2$state = _ref2.state,
                state = _ref2$state === undefined ? {} : _ref2$state,
                _ref2$packets = _ref2.packets,
                packets = _ref2$packets === undefined ? _Packets2.default.Json() : _ref2$packets,
                _ref2$broadcastMessag = _ref2.broadcastMessages,
                broadcastMessages = _ref2$broadcastMessag === undefined ? true : _ref2$broadcastMessag;

            var wsRelay = function wsRelay(msg, _ref3) {
                var emit = _ref3.emit,
                    broadcast = _ref3.broadcast,
                    network = _ref3.network;

                if (broadcastMessages) {
                    broadcast(msg);
                } else {
                    emit(_Message2.default.Generate(network, _Network3.default.Signal.RELAY, msg));
                }
            };

            var client = new this(state, {
                default: _extends((_extends2 = {}, _defineProperty(_extends2, Client.Signal.CLOSE, wsRelay), _defineProperty(_extends2, Client.Signal.ERROR, wsRelay), _defineProperty(_extends2, Client.Signal.MESSAGE, wsRelay), _defineProperty(_extends2, Client.Signal.MESSAGE_ERROR, wsRelay), _defineProperty(_extends2, Client.Signal.OPEN, wsRelay), _defineProperty(_extends2, Client.Signal.PING, wsRelay), _defineProperty(_extends2, Client.Signal.PONG, wsRelay), _defineProperty(_extends2, Client.Signal.UNEXPECTED_RESPONSE, wsRelay), _defineProperty(_extends2, Client.Signal.UPGRADE, wsRelay), _defineProperty(_extends2, Client.Signal.MESSAGE, function (_ref4, _ref5) {
                    var data = _ref4.data;
                    var emit = _ref5.emit,
                        broadcast = _ref5.broadcast;

                    var _data = _slicedToArray(data, 1),
                        msg = _data[0];

                    if (broadcastMessages) {
                        broadcast(msg);
                    } else {
                        emit(msg);
                    }
                }), _extends2), handlers)
            }, _extends({}, wsOpts, packets));

            client.alter({
                default: {
                    $globals: {
                        sendToServer: client.sendToServer.bind(client)
                    }
                }
            });

            return client;
        }
    }]);

    return Client;
}(_Network3.default);

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

var QuickSetup = exports.QuickSetup = Client.QuickSetup;

exports.default = Client;