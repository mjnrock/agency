"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Server = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.QuickSetup = QuickSetup;

var _Packets = require("./Packets");

var _Packets2 = _interopRequireDefault(_Packets);

var _Network = require("../../event/Network");

var _Dispatcher2 = require("../../event/Dispatcher");

var _Dispatcher3 = _interopRequireDefault(_Dispatcher2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Server = exports.Server = function (_Dispatcher) {
    _inherits(Server, _Dispatcher);

    function Server(wss, network) {
        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            packer = _ref.packer,
            unpacker = _ref.unpacker;

        _classCallCheck(this, Server);

        var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this, network));

        _this.subject = _this;
        _this.wss = wss;

        if (typeof packer === "function") {
            _this._packer = packer;
        }
        if (typeof unpacker === "function") {
            _this._unpacker = unpacker;
        }

        _this._bind(_this.wss.getWss(), _this.wss.app);
        return _this;
    }

    _createClass(Server, [{
        key: "_bind",
        value: function _bind(wss, app) {
            var _this2 = this;

            wss.on("listening", function () {
                return _this2.dispatch(Server.Signal.LISTENING);
            });
            wss.on("close", function () {
                return _this2.dispatch(Server.Signal.CLOSE);
            });
            wss.on("connection", function (client) {
                return _this2.dispatch(Server.Signal.CONNECTION, client);
            });
            wss.on("headers", function (headers, req) {
                return _this2.dispatch(Server.Signal.HEADERS, headers, req);
            });

            app.ws("/", function (client, req) {
                client.on("message", function (packet) {
                    try {
                        var msg = void 0;
                        if (typeof _this2._unpacker === "function") {
                            msg = _this2._unpacker.call(_this2, packet);
                        } else {
                            msg = packet;
                        }

                        _this2.dispatch(Server.Signal.Client.MESSAGE, msg, client, req);
                    } catch (e) {
                        _this2.dispatch(Server.Signal.Client.MESSAGE_ERROR, e, packet, client, req);
                    }
                });
                client.on("close", function (code, reason) {
                    return _this2.dispatch(Server.Signal.Client.DISCONNECT, code, reason);
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

            if (typeof this._packer === "function") {
                var _packer;

                msg = (_packer = this._packer).call.apply(_packer, [this, type].concat(payload));
            } else {
                msg = payload;
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
    }]);

    return Server;
}(_Dispatcher3.default);

Server.Signal = {
    LISTENING: "WebSocketServer.Listening",
    CLOSE: "WebSocketServer.Close",
    CONNECTION: "WebSocketServer.Connection",
    HEADERS: "WebSocketServer.Headers",

    Client: {
        MESSAGE: "WebSocketServer.Client.Message",
        MESSAGE_ERROR: "WebSocketServer.Client.MessageError",
        DISCONNECT: "WebSocketServer.Client.Disconnect"
    }
};
;

/**
 * Create a new <BasicNetwork> and a new <Server>, returning
 *  the newly created server.  The network can be accessed
 *  via << server.network >>.
 * 
 * The main convenience is that this setup will use the
 *  << Packets.JSON >> paradigm and setup the local
 *  message routing from packets received and unpackaged
 *  by the <Server>.  As such, the @handlers are those
 *  that should receive the unpackaged packets.
 */
function QuickSetup(server) {
    var _extends2;

    var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$packets = _ref2.packets,
        packets = _ref2$packets === undefined ? _Packets2.default.Json() : _ref2$packets;

    /**
     * The <BasicNetwork> is a fully-featured <Network> that comes preconfigured
     *  as a single-route (firstMatch), single-context (named "default") network
     *  with real-time processing.
     */
    var network = new _Network.BasicNetwork(_extends((_extends2 = {}, _defineProperty(_extends2, Server.Signal.LISTENING, function () {}), _defineProperty(_extends2, Server.Signal.CLOSE, function () {}), _defineProperty(_extends2, Server.Signal.CONNECTION, function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
            client = _ref4[0];
    }), _defineProperty(_extends2, Server.Signal.HEADERS, function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            headers = _ref6[0],
            req = _ref6[1];
    }), _defineProperty(_extends2, Server.Signal.Client.MESSAGE, function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 3),
            _ref8$ = _ref8[0],
            type = _ref8$.type,
            payload = _ref8$.payload,
            client = _ref8[1],
            req = _ref8[2];

        if (!Array.isArray(payload)) {
            payload = [payload];
        }

        console.log(type, payload);

        network.emit.apply(network, [client, type].concat(_toConsumableArray(payload)));
    }), _defineProperty(_extends2, Server.Signal.Client.DISCONNECT, function (_ref9) {
        var _ref10 = _slicedToArray(_ref9, 2),
            code = _ref10[0],
            reason = _ref10[1];

        return console.log("Client left with code " + code);
    }), _extends2), handlers));
    var wss = new Server(server, network, _extends({}, packets));

    network.storeGlobal({
        server: wss,
        network: network
    });

    return wss;
};

exports.default = Server;