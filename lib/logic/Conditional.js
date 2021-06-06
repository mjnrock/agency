"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Conditional = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Proposition = require("./Proposition");

var _Proposition2 = _interopRequireDefault(_Proposition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Conditional = exports.Conditional = function () {
    function Conditional(prop, fn) {
        _classCallCheck(this, Conditional);

        this.antecedent = prop;
        this.consequent = fn;
    }

    _createClass(Conditional, [{
        key: "test",
        value: function test() {
            var _antecedent;

            if (typeof this.antecedent === "function" && this.antecedent.apply(this, arguments) === true) {
                return true;
            } else if (this.antecedent instanceof _Proposition2.default && (_antecedent = this.antecedent).test.apply(_antecedent, arguments) === true) {
                return true;
            }

            return false;
        }
    }, {
        key: "attempt",
        value: function attempt() {
            var ifArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var thenArgs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            if (this.test.apply(this, _toConsumableArray(ifArgs)) === true) {
                return this.consequent.apply(this, _toConsumableArray(thenArgs));
            }
        }
    }, {
        key: "toObject",
        value: function toObject() {
            var obj = {
                antecedent: this.antecedent,
                consequent: this.consequent
            };

            return obj;
        }
    }, {
        key: "toJson",
        value: function toJson() {
            var obj = {
                antecedent: this.antecedent,
                consequent: this.consequent
            };

            return JSON.stringify(obj, function (key, value) {
                if (key === "consequent") {
                    return value.toString();
                }

                return value;
            });
        }
    }], [{
        key: "FromObject",
        value: function FromObject() {
            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (typeof obj.consequent === "string" || obj.consequent instanceof String) {
                obj.consequent = eval(obj.consequent);
            }

            if (obj.antecedent instanceof _Proposition2.default) {
                return new Conditional(obj.antecedent, obj.consequent);
            }

            return new Conditional(_Proposition2.default.FromObject(obj.antecedent), obj.consequent);
        }
    }, {
        key: "FromJson",
        value: function FromJson() {
            var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            try {
                var obj = json;
                while (typeof obj === "string" || obj instanceof String) {
                    obj = JSON.parse(obj);
                }

                return Conditional.FromObject(obj);
            } catch (e) {
                console.log(e);
                return false;
            }
        }
    }]);

    return Conditional;
}();

;

exports.default = Conditional;