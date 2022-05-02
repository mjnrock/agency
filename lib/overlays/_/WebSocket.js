"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.WebSocketNodeClient = exports.EnumTriggers = undefined;

var _uuid = require("uuid");

var _ws = require("ws");

var _ws2 = _interopRequireDefault(_ws);

var _Node = require("../node/Node");

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EnumTriggers = exports.EnumTriggers = ["close", "error", "message", "message_error", "open", "ping", "pong", "unexpected_response", "upgrade"];

//TODO Create an isomorphic client and server for browser & nodejs
// Magic object that interacts with registry ({ $state, $actions, etc. })
var WebSocketNodeClient = exports.WebSocketNodeClient = function WebSocketNodeClient(target) {
	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    $state = _ref.$state,
	    $actions = _ref.$actions;

	var $ = target.meta.state;

	return {
		// state: {},
		// nodes: {},
		triggers: [].concat(EnumTriggers),
		// subscriptions: [],
		meta: {
			state: { // Take the meta states for each Overlay, register with $id into neta state registry -- is stored like target.meta.state[ $id ]{ ... }
				$id: (0, _uuid.v4)(),

				connection: null,
				middleware: {
					pack: null,
					unpack: null
				}
			}
		},
		config: {},
		actions: {
			useNodeBuffer: function useNodeBuffer() {
				$.connection.binaryType = "nodebuffer";
			},
			useArrayBuffer: function useArrayBuffer() {
				$.connection.binaryType = "arraybuffer";
			},
			useFragments: function useFragments() {
				$.connection.binaryType = "fragments";
			},
			connect: function connect() {
				var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
				    url = _ref2.url,
				    host = _ref2.host,
				    _ref2$protocol = _ref2.protocol,
				    protocol = _ref2$protocol === undefined ? "http" : _ref2$protocol,
				    port = _ref2.port,
				    ws = _ref2.ws;

				if (ws instanceof _ws2.default) {
					$.connection = ws;
				} else if (host && protocol && port) {
					$.connection = new _ws2.default(protocol + "://" + host + ":" + port);
				} else {
					$.connection = new _ws2.default(url);
				}

				target.bind($.connection);

				return target;
			},
			bind: function bind(client) {
				client.addEventListener("close", function (code, reason) {
					return target.actions.invoke("close", code, reason);
				});
				client.addEventListener("error", function (error) {
					return target.actions.invoke("error", error);
				});
				client.addEventListener("message", function (packet) {
					try {
						//TODO Refactor for Hive
						// let msg;
						// if (typeof $.middleware.unpack === "function") {
						// 	const { type, payload } = $.middleware.unpack.call(target, packet);

						// 	msg = Message.Generate(target, type, ...payload);
						// } else {
						// 	msg = packet;
						// }

						target.actions.invoke("message", msg);
					} catch (e) {
						target.actions.invoke("message_error", e, packet);
					}
				});
				client.addEventListener("open", function () {
					return target.actions.invoke("open");
				});
				client.addEventListener("ping", function (data) {
					return target.actions.invoke("ping", data);
				});
				client.addEventListener("pong", function (data) {
					return target.actions.invoke("pong", data);
				});
				client.addEventListener("unexpected-response", function (req, res) {
					return target.actions.invoke("unexpected_response", req, res);
				});
				client.addEventListener("upgrade", function (res) {
					return target.actions.invoke("upgrade", res);
				});

				return target;
			},
			isConnecting: function isConnecting() {
				return $.connection.readyState === 0;
			},
			isConnected: function isConnected() {
				return $.connection.readyState === 1;
			},
			isClosing: function isClosing() {
				return $.connection.readyState === 2;
			},
			isClosed: function isClosed() {
				return $.connection.readyState === 3;
			},
			sendToServer: function sendToServer(data) {
				if (target.actions.isConnected()) {
					// let data;
					// if (typeof this.middleware.pack === "function") {
					// 	if (Message.Conforms(event)) {
					// 		data = this.middleware.pack.call(this, event.type, ...event.data);
					// 	} else {
					// 		data = this.middleware.pack.call(this, event, ...payload);
					// 	}
					// } else {
					// 	data = [ event, payload ];
					// }

					$.connection.send(data);

					return true;
				}

				return false;
			},
			disconnect: function disconnect(code, reason) {
				var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

				$.connection.close(code, reason);

				if (typeof timeout === "number" && timeout > 0) {
					setTimeout(function () {
						try {
							if (!target.actions.isClosed()) {
								target.actions.kill();
							}
						} catch (e) {
							target.actions.invoke("error", e);
						}
					}, timeout);
				}
			},
			kill: function kill() {
				$.connection.terminate();
			}
		}
	};
};

exports.default = WebSocketNodeClient;