"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _package = require("./websocket/package");

var _package2 = _interopRequireDefault(_package);

var _package3 = require("./react/package");

var _package4 = _interopRequireDefault(_package3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    WebSocket: _package2.default,
    React: _package4.default
};