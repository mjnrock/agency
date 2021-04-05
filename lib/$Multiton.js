"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
             * Recreate the .Instances registry with optional seeding
             */
            value: function Recreate() {
                var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                var createDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                this.Instances = new this(_defineProperty({}, this.toString(), { entries: entries }));

                if (createDefault) {
                    this.Instances.register(new this(), "default");
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
        }]);

        function _class() {
            var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var rest = _objectWithoutProperties(_ref2, []);

            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, _extends({}, rest)));
        }

        return _class;
    }($super), _class.Instances = new undefined(), _temp;
};

exports.$Multiton = $Multiton;
exports.default = $Multiton;