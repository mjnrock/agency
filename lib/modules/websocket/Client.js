"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QuickSetup = exports.Client = undefined;

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

var Client = exports.Client = function (_Network) {
    _inherits(Client, _Network);

    function Client() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var alter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, Client);

        var _this = _possibleConstructorReturn(this, (Client.__proto__ || Object.getPrototypeOf(Client)).call(this, state, alter));

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

                if (typeof this._packer === "function") {
                    if (_Message2.default.Conforms(event)) {
                        var _packer;

                        data = (_packer = this._packer).call.apply(_packer, [this, event.type].concat(_toConsumableArray(event.data)));
                    } else {
                        var _packer2;

                        data = (_packer2 = this._packer).call.apply(_packer2, [this, event].concat(payload));
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
            var _this2 = this;

            var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            this.connection.close(code, reason);

            if (typeof timeout === "number" && timeout > 0) {
                setTimeout(function () {
                    try {
                        if (!_this2.isClosed) {
                            _this2.kill();
                        }
                    } catch (e) {
                        _this2.emit(Client.Signal.ERROR, e);
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
    }], [{
        key: "QuickSetup",
        value: function QuickSetup() {
            var wsOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var _extends2;

            var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref$state = _ref.state,
                state = _ref$state === undefined ? {} : _ref$state,
                _ref$packets = _ref.packets,
                packets = _ref$packets === undefined ? _Packets2.default.NodeJson() : _ref$packets,
                _ref$clientClass = _ref.clientClass,
                clientClass = _ref$clientClass === undefined ? Client : _ref$clientClass,
                _ref$broadcastMessage = _ref.broadcastMessages,
                broadcastMessages = _ref$broadcastMessage === undefined ? true : _ref$broadcastMessage;

            var wsRelay = function wsRelay(msg, _ref2) {
                var emit = _ref2.emit,
                    broadcast = _ref2.broadcast;

                if (broadcastMessages) {
                    broadcast(msg);
                } else {
                    emit(msg);
                }
            };

            var client = new clientClass(state, {
                default: _extends((_extends2 = {}, _defineProperty(_extends2, Client.Signal.CLOSE, wsRelay), _defineProperty(_extends2, Client.Signal.ERROR, wsRelay), _defineProperty(_extends2, Client.Signal.MESSAGE, wsRelay), _defineProperty(_extends2, Client.Signal.MESSAGE_ERROR, wsRelay), _defineProperty(_extends2, Client.Signal.OPEN, wsRelay), _defineProperty(_extends2, Client.Signal.PING, wsRelay), _defineProperty(_extends2, Client.Signal.PONG, wsRelay), _defineProperty(_extends2, Client.Signal.UNEXPECTED_RESPONSE, wsRelay), _defineProperty(_extends2, Client.Signal.UPGRADE, wsRelay), _defineProperty(_extends2, Client.Signal.MESSAGE, function (_ref3, _ref4) {
                    var data = _ref3.data;
                    var emit = _ref4.emit,
                        broadcast = _ref4.broadcast;

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