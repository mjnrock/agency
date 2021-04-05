"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.$Multiton = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Registry = require("./Registry");

var _Registry2 = _interopRequireDefault(_Registry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $Multiton = function $Multiton($super) {
    var _class, _temp;

    return _temp = _class = function (_$super) {
        _inherits(_class, _$super);

        _createClass(_class, null, [{
            key: "Recreate",


            /**
             * Recreate the .Instances registry
             */
            value: function Recreate() {
                var registerArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                var createDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                var defaultArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

                this.Instances = new _Registry2.default();

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = registerArgs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var entry = _step.value;

                        if (Array.isArray(entry)) {
                            var _entry = _toArray(entry),
                                _this = _entry[0],
                                synonyms = _entry.slice(1);

                            if (_this instanceof this) {
                                var _Instances;

                                (_Instances = this.Instances).register.apply(_Instances, [_this].concat(_toConsumableArray(synonyms)));
                            }
                        } else {
                            this.Instances.register(entry);
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

                if (createDefault) {
                    this.Instances.register(new (Function.prototype.bind.apply(this, [null].concat(_toConsumableArray(defaultArgs))))(), "default");
                }
            }
        }, {
            key: "$",

            /**
             * A convenience getter to easily access a default <Registry>
             *  when a multi-Registry setup is unnecessary.
             */
            get: function get() {
                if (!(this.Instances || {}).default) {
                    this.Recreate();
                }

                return this.Instances.default;
            }
        }, {
            key: "_",
            get: function get() {
                if (!this.Instances) {
                    this.Recreate();
                }

                return this.Instances;
            }
        }]);

        function _class() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var rest = _objectWithoutProperties(_ref, []);

            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, _extends({}, rest)));
        }

        return _class;
    }($super), _class.Instances = new _Registry2.default(), _temp;
};

exports.$Multiton = $Multiton;
exports.default = $Multiton;