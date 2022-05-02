"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.useFlux = useFlux;

var _useAgency = require("./useAgency");

var _useAgency2 = _interopRequireDefault(_useAgency);

var _react = require("react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useFlux() {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    i_state = _ref.state,
	    i_reducers = _ref.reducers;

	var _useState = (0, _react.useState)(i_state || {}),
	    _useState2 = _slicedToArray(_useState, 2),
	    state = _useState2[0],
	    setState = _useState2[1];

	var _useState3 = (0, _react.useState)(i_reducers || []),
	    _useState4 = _slicedToArray(_useState3, 2),
	    reducers = _useState4[0],
	    setReducers = _useState4[1];

	var dispatch = function dispatch(type) {
		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			args[_key - 1] = arguments[_key];
		}

		var next = void 0;
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = reducers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var reducer = _step.value;

				/**
     * Note the general order of arguments, as they
     * are *inconsistent* with the dispatch function
     * and are instead ordered by usefulness to the
     * reducer function
     * 
     * In general, the reducer follows the form:
     * 		reducer(data, meta/opts);
     */
				next = reducer(args, { type: type, state: next });
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		if (next !== void 0) {
			setState(next);
		}
	};

	(0, _react.useEffect)(function () {
		if (Array.isArray(i_reducers)) {
			/**
    * Each reducer should be a function that returns the next
    * state
    */
			setReducers(i_reducers);
		} else if ((typeof i_reducers === "undefined" ? "undefined" : _typeof(i_reducers)) === "object") {
			/**
    * If using an object, the key will be used as a type-check,
    * and the value (which should be a fn) will be used as the
    * reducer
    */
			var newReducers = [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				var _loop = function _loop() {
					var _step2$value = _slicedToArray(_step2.value, 2),
					    key = _step2$value[0],
					    fn = _step2$value[1];

					newReducers.push(function (args, _ref2) {
						var type = _ref2.type,
						    state = _ref2.state;

						if (key === type) {
							return fn(args, { type: type, state: state });
						}

						return state;
					});
				};

				for (var _iterator2 = Object.entries(i_reducers)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					_loop();
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			setReducers(newReducers);
		}
	}, [i_reducers]);

	return {
		state: state,
		dispatch: dispatch
	};
};

exports.default = {
	useFlux: useFlux,
	useAgency: _useAgency2.default
};