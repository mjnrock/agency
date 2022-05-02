"use strict";

var _Agency = require("../core/Agency");

var _Agency2 = _interopRequireDefault(_Agency);

var _Agent = require("../core/Agent");

var _Agent2 = _interopRequireDefault(_Agent);

var _Message = require("../core/comm/Message");

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var agency = new _Agency2.default();
var agent = new _Agent2.default();
// console.log(agency.id);
// console.log(agent.id);

var msg = _Message2.default.Generate(123435, ["test", "cat"], {
	info: {
		isLocked: true
	}
});
console.log(msg);
console.log(msg.type);

console.log(msg.data);
msg.info.isLocked = false;
msg.data = 9874;
console.log(msg.data);