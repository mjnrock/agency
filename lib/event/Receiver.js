"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Receiver = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AgencyBase2 = require("../AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Receiver = exports.Receiver = function (_AgencyBase) {
    _inherits(Receiver, _AgencyBase);

    function Receiver(callback, filter) {
        _classCallCheck(this, Receiver);

        var _this = _possibleConstructorReturn(this, (Receiver.__proto__ || Object.getPrototypeOf(Receiver)).call(this));

        _this.__callback = callback;
        _this.__filter = filter;
        return _this;
    }

    _createClass(Receiver, [{
        key: "receive",
        value: function receive(message) {
            if (typeof this.__filter === "function") {
                if (this.__filter(message) === false) {
                    return;
                }
            }

            if (typeof this.__callback === "function") {
                return this.__callback(message);
            }
        }
    }, {
        key: "reassign",
        value: function reassign(callback) {
            if (typeof callback === "function") {
                this.__callback = callback;
            }
        }
    }, {
        key: "refilter",
        value: function refilter(fn) {
            if (typeof fn === "function") {
                this.__filter === fn;
            }
        }
    }], [{
        key: "Typed",
        value: function Typed() {
            var types = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var include = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (!Array.isArray(types)) {
                types = [types];
            }

            return function (message) {
                if (include === true) {
                    return types.includes(message.type);
                }

                return !types.includes(message.type);
            };
        }
    }, {
        key: "Filtered",
        value: function Filtered() {
            var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var include = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (!Array.isArray(fn)) {
                fn = [fn];
            }

            return function (message) {
                if (include === true) {
                    return fn.every(message);
                }

                return !fn.every(message);
            };
        }
    }]);

    return Receiver;
}(_AgencyBase3.default);

;

exports.default = Receiver;