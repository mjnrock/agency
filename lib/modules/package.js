"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _package = require("./qrcode/package");

var _package2 = _interopRequireDefault(_package);

var _package3 = require("./websocket/package");

var _package4 = _interopRequireDefault(_package3);

var _package5 = require("./react/package");

var _package6 = _interopRequireDefault(_package5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    QRCode: _package2.default,
    WebSocket: _package4.default,
    React: _package6.default
};