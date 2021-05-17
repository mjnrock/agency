"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QuickSetup = exports.Server = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var Server = exports.Server = function (_Network) {
    _inherits(Server, _Network);

    function Server(wss) {
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var modify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        _classCallCheck(this, Server);

        var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this, state, modify));

        _this.wss = wss;

        _this.middleware = {
            pack: opts.pack,
            unpack: opts.unpack
        };

        _this._bind(_this.wss.getWss(), _this.wss.app);

        return _this;
    }

    _createClass(Server, [{
        key: "_bind",
        value: function _bind(wss, app) {
            var _this2 = this;

            wss.on("listening", function () {
                return _this2.message(Server.Signal.LISTENING);
            });
            wss.on("close", function () {
                return _this2.message(Server.Signal.CLOSE);
            });
            wss.on("connection", function (client) {
                return _this2.message(Server.Signal.CONNECTION, client);
            });
            wss.on("headers", function (headers, req) {
                return _this2.message(Server.Signal.HEADERS, headers, req);
            });

            app.ws("/", function (client, req) {
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

                        _this2.message(Server.Signal.MESSAGE, msg, client, req);
                    } catch (e) {
                        _this2.message(Server.Signal.MESSAGE_ERROR, e, packet, client, req);
                    }
                });
                client.addEventListener("close", function (code, reason) {
                    return _this2.message(Server.Signal.DISCONNECT, code, reason);
                });
            });
        }
    }, {
        key: "sendToClient",
        value: function sendToClient(client, type) {
            var msg = void 0;

            for (var _len = arguments.length, payload = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                payload[_key - 2] = arguments[_key];
            }

            if (typeof this.middleware.pack === "function") {
                if (_Message2.default.ConformsBasic(type)) {
                    var _middleware$pack;

                    msg = (_middleware$pack = this.middleware.pack).call.apply(_middleware$pack, [this, type.type].concat(_toConsumableArray(type.data)));
                } else {
                    var _middleware$pack2;

                    msg = (_middleware$pack2 = this.middleware.pack).call.apply(_middleware$pack2, [this, type].concat(payload));
                }
            } else {
                msg = [type, payload];
            }

            client.send(msg);

            return this;
        }
    }, {
        key: "sendToAll",
        value: function sendToAll(type) {
            for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                payload[_key2 - 1] = arguments[_key2];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.clients[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var client = _step.value;

                    this.sendToClient.apply(this, [client, type].concat(payload));
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

            return this;
        }
    }, {
        key: "clients",
        get: function get() {
            return this.wss.getWss().clients;
        }
    }], [{
        key: "QuickSetup",
        value: function QuickSetup(wss) {
            var _extends2;

            var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref$state = _ref.state,
                state = _ref$state === undefined ? {} : _ref$state,
                _ref$packets = _ref.packets,
                packets = _ref$packets === undefined ? _Packets2.default.Json() : _ref$packets,
                _ref$broadcastMessage = _ref.broadcastMessages,
                broadcastMessages = _ref$broadcastMessage === undefined ? true : _ref$broadcastMessage;

            var wsRelay = function wsRelay(msg, _ref2) {
                var message = _ref2.message,
                    broadcast = _ref2.broadcast,
                    network = _ref2.network;

                if (broadcastMessages) {
                    broadcast(msg);
                } else {
                    message(_Message2.default.Generate(network, _Network3.default.Signal.RELAY, msg));
                }
            };

            var server = new Server(wss, state, {
                default: _extends((_extends2 = {}, _defineProperty(_extends2, Server.Signal.LISTENING, wsRelay), _defineProperty(_extends2, Server.Signal.CLOSE, wsRelay), _defineProperty(_extends2, Server.Signal.ERROR, wsRelay), _defineProperty(_extends2, Server.Signal.CONNECTION, wsRelay), _defineProperty(_extends2, Server.Signal.HEADERS, wsRelay), _defineProperty(_extends2, Server.Signal.MESSAGE_ERROR, wsRelay), _defineProperty(_extends2, Server.Signal.DISCONNECT, wsRelay), _defineProperty(_extends2, Server.Signal.MESSAGE, function (_ref3, _ref4) {
                    var data = _ref3.data;
                    var message = _ref4.message,
                        broadcast = _ref4.broadcast;

                    var _data = _slicedToArray(data, 1),
                        msg = _data[0];

                    if (broadcastMessages) {
                        broadcast(msg);
                    } else {
                        message(msg);
                    }
                }), _extends2), handlers)
            }, _extends({}, packets));

            server.modify({
                default: {
                    $globals: {
                        sendToClient: server.sendToClient.bind(server),
                        sendToAll: server.sendToAll.bind(server)
                    }
                }
            });

            return server;
        }
    }]);

    return Server;
}(_Network3.default);

Server.Signal = {
    LISTENING: "WebSocketServer:Listening",
    CLOSE: "WebSocketServer:Close",
    ERROR: "WebSocketServer:Error",
    CONNECTION: "WebSocketServer:Connection",
    HEADERS: "WebSocketServer:Headers",
    MESSAGE: "WebSocketServer:Message",
    MESSAGE_ERROR: "WebSocketServer:MessageError",
    DISCONNECT: "WebSocketServer:Disconnect"
};
;

var QuickSetup = exports.QuickSetup = Server.QuickSetup;

exports.default = Server;