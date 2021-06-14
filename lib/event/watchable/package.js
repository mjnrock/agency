"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Watchable = require("./Watchable");

var _Watchable2 = _interopRequireDefault(_Watchable);

var _EventWatchable = require("./EventWatchable");

var _EventWatchable2 = _interopRequireDefault(_EventWatchable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    Watchable: _Watchable2.default,
    EventWatchable: _EventWatchable2.default
};