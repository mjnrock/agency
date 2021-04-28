"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Predicate = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Proposition2 = require("./Proposition");

var _Proposition3 = _interopRequireDefault(_Proposition2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This class probably doesn't need to exist, but here we are.
 * It serves a purpose in its own way.
 */
var Predicate = exports.Predicate = function (_Proposition) {
    _inherits(Predicate, _Proposition);

    function Predicate(fn) {
        var constants = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, Predicate);

        var _this = _possibleConstructorReturn(this, (Predicate.__proto__ || Object.getPrototypeOf(Predicate)).call(this, fn instanceof _Proposition3.default ? fn.props[0] : fn));

        _this.constants = constants;
        return _this;
    }

    _createClass(Predicate, [{
        key: "all",
        value: function all(consequent) {
            var _Proposition$IMPLY;

            for (var _len = arguments.length, variables = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                variables[_key - 1] = arguments[_key];
            }

            return (_Proposition$IMPLY = _Proposition3.default.IMPLY(this, consequent)).test.apply(_Proposition$IMPLY, _toConsumableArray(this.constants).concat(variables));
        }
    }, {
        key: "notAll",
        value: function notAll(consequent) {
            var _Proposition$NOT;

            for (var _len2 = arguments.length, variables = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                variables[_key2 - 1] = arguments[_key2];
            }

            return (_Proposition$NOT = _Proposition3.default.NOT(_Proposition3.default.IMPLY(this, consequent))).test.apply(_Proposition$NOT, _toConsumableArray(this.constants).concat(variables));
        }
    }, {
        key: "exists",
        value: function exists(conjunct) {
            var _Proposition$AND;

            for (var _len3 = arguments.length, variables = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                variables[_key3 - 1] = arguments[_key3];
            }

            return (_Proposition$AND = _Proposition3.default.AND(this, conjunct)).test.apply(_Proposition$AND, _toConsumableArray(this.constants).concat(variables));
        }
    }, {
        key: "notExists",
        value: function notExists(conjunct) {
            var _Proposition$NOT2;

            for (var _len4 = arguments.length, variables = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                variables[_key4 - 1] = arguments[_key4];
            }

            return (_Proposition$NOT2 = _Proposition3.default.NOT(_Proposition3.default.AND(this, conjunct))).test.apply(_Proposition$NOT2, _toConsumableArray(this.constants).concat(variables));
        }
    }], [{
        key: "ALL",
        value: function ALL(predicate, consequent) {
            for (var _len5 = arguments.length, constants = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
                constants[_key5 - 2] = arguments[_key5];
            }

            return _Proposition3.default.IMPLY(new Predicate(predicate, constants), consequent);
        }
    }, {
        key: "NOT_ALL",
        value: function NOT_ALL(predicate, consequent) {
            for (var _len6 = arguments.length, constants = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
                constants[_key6 - 2] = arguments[_key6];
            }

            return _Proposition3.default.NOT(_Proposition3.default.IMPLY(new Predicate(predicate, constants), consequent));
        }
    }, {
        key: "EXISTS",
        value: function EXISTS(predicate, conjunct) {
            for (var _len7 = arguments.length, constants = Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
                constants[_key7 - 2] = arguments[_key7];
            }

            return _Proposition3.default.AND(new Predicate(predicate, constants), conjunct);
        }
    }, {
        key: "NOT_EXISTS",
        value: function NOT_EXISTS(predicate, conjunct) {
            for (var _len8 = arguments.length, constants = Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
                constants[_key8 - 2] = arguments[_key8];
            }

            return _Proposition3.default.NOT(_Proposition3.default.AND(new Predicate(predicate, constants), conjunct));
        }
    }]);

    return Predicate;
}(_Proposition3.default);

;

exports.default = Predicate;