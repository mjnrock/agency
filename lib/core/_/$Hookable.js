"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hookable = exports.Hookable = function Hookable() {
	_classCallCheck(this, Hookable);

	this.__config = {
		isPrivate: true
	};
	this.__hooks = {
		fn: [],
		get: [],
		set: []
	};

	return new Proxy(this, {
		get: function get(target, prop) {
			if (prop[0] === "_" && target.__config.isPrivate === true) {
				return Reflect.get(target, prop);
			}

			var result = Reflect.get(target, prop);

			//TODO Account for nuances here
			// if(typeof result === "function") {
			// 	return (...args) => {
			// 		const ret = result(...args);

			// 		for(let fn of target._hooks.fn) {
			// 			fn({ prop, result: ret, target });
			// 		}

			// 		return ret;
			// 	};
			// }

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = target.__hooks.get[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var fn = _step.value;

					fn({ prop: prop, result: result, target: target });
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

			return result;
		},
		set: function set(target, prop, value) {
			if (prop[0] === "_" && target.__config.isPrivate === true) {
				return Reflect.set(target, prop, value);
			}

			var previous = Reflect.get(target, prop);
			var result = Reflect.set(target, prop, value);

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = target.__hooks.set[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var fn = _step2.value;

					fn({ prop: prop, value: value, previous: previous, target: target });
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

			return result;
		}
	});
};

;

exports.default = Hookable;