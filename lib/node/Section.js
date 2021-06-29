"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Section = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Entry2 = require("./Entry");

var _Entry3 = _interopRequireDefault(_Entry2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Section = exports.Section = function (_Entry) {
	_inherits(Section, _Entry);

	function Section(data) {
		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		var _ref$children = _ref.children,
		    children = _ref$children === undefined ? [] : _ref$children,
		    type = _ref.type,
		    opts = _objectWithoutProperties(_ref, ["children", "type"]);

		_classCallCheck(this, Section);

		var _this = _possibleConstructorReturn(this, (Section.__proto__ || Object.getPrototypeOf(Section)).call(this, type || Section.Type, data, opts));

		_this.setChildren(children);
		return _this;
	}

	_createClass(Section, [{
		key: "setChildren",
		value: function setChildren(children) {
			this.children = new Set();

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var child = _step.value;

					if (child instanceof _Entry3.default) {
						this.children.add(child);
					}
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

			return this;
		}
	}], [{
		key: "Conforms",
		value: function Conforms(obj) {
			return "type" in obj && obj.type === Section.Type && "data" in obj && "meta" in obj && "children" in obj;
		}
	}, {
		key: "FromObject",
		value: function FromObject(obj) {
			if (this.Conforms(obj)) {
				var children = obj.children.map(function (child) {
					if (Section.Conforms(child)) {
						return Section.FromObject(child);
					} else if (_Entry3.default.Conforms(child)) {
						return _Entry3.default.FromObject(child);
					}
				});

				return new Section(obj.data, {
					meta: obj.meta,
					children: children
				});
			}

			return false;
		}
	}]);

	return Section;
}(_Entry3.default);

Section.Type = "section";
;

exports.default = Section;