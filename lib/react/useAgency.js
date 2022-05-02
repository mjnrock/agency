"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.useAgent = useAgent;
exports.useAgency = useAgency;

var _react = require("react");

function useAgent(agent) {
	var _useState = (0, _react.useState)(agent.state),
	    _useState2 = _slicedToArray(_useState, 2),
	    state = _useState2[0],
	    setState = _useState2[1];

	(0, _react.useEffect)(function () {
		var handler = function handler() {
			return setState(agent.state);
		};

		agent.addTrigger(agent.config.notifyTrigger, handler);

		return function () {
			agent.removeTrigger(agent.config.notifyTrigger, handler);
		};
	}, []);

	return {
		agent: agent,
		state: state,
		dispatch: agent.invoke.bind(agent)
	};
}

function useAgency(context, key) {
	var agent = (0, _react.useContext)(key ? context[key] : context);
	var controlObj = useAgent(agent);

	return controlObj;
}

exports.default = useAgency;