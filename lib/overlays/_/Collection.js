"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Collection = undefined;

var _Proposition = require("../util/logic/Proposition");

var _Proposition2 = _interopRequireDefault(_Proposition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//TODO Have all Overlays go into a named-scope for each respective attribute (e.g. @node.state.Collection.entries)
//TODO Create a "smart selector" on Node for overlays so that overlay name doesn't have to be explicitly used (e.g. @node.state.$$.entries)

/**
 * This is a base-level class for when a Node is to be used
 * 	as an optionally-typed recordset repository for some data
 */
var Collection = exports.Collection = function Collection(target) {
	return {
		$iterator: function $iterator(node, overlay) {
			node[Symbol.iterator] = function () {
				var index = -1;
				var data = Object.values(node.state.entries);

				return {
					next: function next() {
						return { value: data[++index], done: !(index in data) };
					}
				};
			};
		},


		state: {
			schema: null,
			entries: []
		},
		// nodes: {},
		triggers: ["addEntry", "removeEntry"],
		// subscriptions: [],
		// meta: {},
		config: {
			isReadOnly: false
		},
		actions: {
			setSchema: function setSchema(schema) {
				target.state.schema = schema;

				return target;
			},
			addEntry: function addEntry() {
				for (var _len = arguments.length, entries = Array(_len), _key = 0; _key < _len; _key++) {
					entries[_key] = arguments[_key];
				}

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var entry = _step.value;

						//TODO	Convert from pseudocode
						// if(node.state.schema.Conforms(entry)) {
						// 	node.state.entries.push(entry);
						// }
						target.state.entries.push(entry);
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

				return target;
			},
			removeEntry: function removeEntry() {
				for (var _len2 = arguments.length, entries = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					entries[_key2] = arguments[_key2];
				}

				target.state.entries = target.state.entries.filter(function (record) {
					return !entries.includes(record);
				});

				return target;
			},
			removeEntryByIndex: function removeEntryByIndex() {
				for (var _len3 = arguments.length, indexes = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
					indexes[_key3] = arguments[_key3];
				}

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = indexes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var index = _step2.value;

						delete target.state.entries[index];
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

				return target;
			},
			head: function head() {
				var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

				try {
					return target.state.entries.slice(0, rows);
				} catch (e) {
					return false;
				}
			},
			tail: function tail() {
				var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

				try {
					return target.state.entries.slice(target.state.entries.length - rows, target.state.entries.length);
				} catch (e) {
					return false;
				}
			},
			at: function at() {
				var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

				try {
					return target.state.entries[index];
				} catch (e) {
					return false;
				}
			},
			bt: function bt(start, end) {
				try {
					return target.state.entries.slice(start, end);
				} catch (e) {
					return false;
				}
			},

			/**
    * @resultFlag:	0 - Entry, 1 - Index, 2 - [ Entry, Index ]
    */
			where: function where(condition) {
				var resultFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

				var results = [];
				for (var i = 0; i < target.state.entries.length; i++) {
					var entry = target.state.entries[i];

					if (condition instanceof _Proposition2.default ? condition.test(entry) : condition(entry)) {
						if (resultFlag === 0) {
							results.push(entry);
						} else if (resultFlag === 1) {
							results.push(i);
						} else if (resultFlag === 2) {
							results.push([i, entry]);
						}
					}
				}

				return results;
			}
		}
	};
};

exports.default = Collection;