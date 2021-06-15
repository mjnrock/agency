"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Proposition = require("./Proposition");

var _Proposition2 = _interopRequireDefault(_Proposition);

var _Predicate = require("./Predicate");

var _Predicate2 = _interopRequireDefault(_Predicate);

var _Conditional = require("./Conditional");

var _Conditional2 = _interopRequireDefault(_Conditional);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    Proposition: _Proposition2.default,
    Predicate: _Predicate2.default,
    Conditional: _Conditional2.default
};