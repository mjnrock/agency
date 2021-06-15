"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RepositoryEntry = undefined;

var _AgencyBase2 = require("./AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

var _Watchable = require("./event/watchable/Watchable");

var _Watchable2 = _interopRequireDefault(_Watchable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import { $Emitter } from "./event/watchable/$Emitter";
// import { compose } from "./util/helper";

// export class RepositoryEntry extends compose($Emitter)(AgencyBase) {
var RepositoryEntry = exports.RepositoryEntry = function (_AgencyBase) {
	_inherits(RepositoryEntry, _AgencyBase);

	function RepositoryEntry(entry, order) {
		var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		var _ref$state = _ref.state,
		    state = _ref$state === undefined ? {} : _ref$state,
		    _ref$synonyms = _ref.synonyms,
		    synonyms = _ref$synonyms === undefined ? [] : _ref$synonyms,
		    opts = _objectWithoutProperties(_ref, ["state", "synonyms"]);

		_classCallCheck(this, RepositoryEntry);

		var _this = _possibleConstructorReturn(this, (RepositoryEntry.__proto__ || Object.getPrototypeOf(RepositoryEntry)).call(this));

		_this._entry = entry;
		_this.order = order;
		_this.state = new _Watchable2.default(state, opts);
		_this.synonyms = synonyms;
		return _this;
	}

	return RepositoryEntry;
}(_AgencyBase3.default);

;

exports.default = RepositoryEntry;