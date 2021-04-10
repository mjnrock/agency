"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _package = require("./util/package");

var _package2 = _interopRequireDefault(_package);

var _package3 = require("./logic/package");

var _package4 = _interopRequireDefault(_package3);

var _package5 = require("./event/package");

var _package6 = _interopRequireDefault(_package5);

var _package7 = require("./watchable/package");

var _package8 = _interopRequireDefault(_package7);

var _Registry = require("./Registry");

var _Registry2 = _interopRequireDefault(_Registry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    Util: _package2.default,
    Logic: _package4.default,

    Event: _package6.default,
    Watchable: _package8.default,

    Registry: _Registry2.default
};