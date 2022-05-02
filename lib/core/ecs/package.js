"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Component = require("./Component");

var _Component2 = _interopRequireDefault(_Component);

var _Entity = require("./Entity");

var _Entity2 = _interopRequireDefault(_Entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//? The Entity in this paradigm is a Node
// import Struct from "./Struct";
exports.default = {
	// Struct,
	Component: _Component2.default,
	// System,
	// Module,
	Entity: _Entity2.default
};
// import System from "./System";
// import Module from "./Module";