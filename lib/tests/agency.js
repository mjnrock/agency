"use strict";

var _Agency = require("../core/Agency");

var _Agency2 = _interopRequireDefault(_Agency);

var _Agent = require("../core/Agent");

var _Agent2 = _interopRequireDefault(_Agent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var agency = new _Agency2.default();
console.log(agency.id);

var agent = new _Agent2.default(); // Create a shallow copy when an Agent is passed
console.log(agent.id);

console.log(agency === agent);