"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReactNetwork = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network2 = require("../../event/Network");

var _Network3 = _interopRequireDefault(_Network2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//TODO  Setup a reducer/dispatch paradigm for React

var ReactNetwork = exports.ReactNetwork = function (_Network) {
    _inherits(ReactNetwork, _Network);

    function ReactNetwork() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var alter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, ReactNetwork);

        var _this = _possibleConstructorReturn(this, (ReactNetwork.__proto__ || Object.getPrototypeOf(ReactNetwork)).call(this, state, alter));

        _this.alter({
            $routes: [function (message) {
                return "react";
            }],
            react: {
                handlers: {
                    "*": function _(msg) {
                        return console.log(msg.type);
                    }
                },
                globals: {
                    network: _this
                }
            }
        });
        return _this;
    }

    _createClass(ReactNetwork, [{
        key: "reduce",
        value: function reduce(_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                state = _ref2[0],
                oldState = _ref2[1];

            var globals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            console.log(state);
            console.log(oldState);
            console.log(globals);
        }
    }]);

    return ReactNetwork;
}(_Network3.default);

;

exports.default = ReactNetwork;