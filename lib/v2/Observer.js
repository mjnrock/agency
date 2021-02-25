"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Observer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Create = Create;
exports.Generate = Generate;

var _uuid = require("uuid");

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _Observable = require("./Observable");

var _Observable2 = _interopRequireDefault(_Observable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Observer = exports.Observer = function (_EventEmitter) {
    _inherits(Observer, _EventEmitter);

    function Observer(observable) {
        _classCallCheck(this, Observer);

        var _this = _possibleConstructorReturn(this, (Observer.__proto__ || Object.getPrototypeOf(Observer)).call(this));

        if (!(observable instanceof _Observable2.default)) {
            throw new Error("@observable must be an <Observable>");
        }

        _this.__id = (0, _uuid.v4)();
        _this.subject = observable;
        return _this;
    }

    _createClass(Observer, [{
        key: "subject",
        get: function get() {
            return this.__subject;
        },
        set: function set(observable) {
            var _this2 = this;

            if (observable instanceof _Observable2.default) {
                this.__subject = observable;
                this.__subject.next = function (props, value) {
                    _this2.emit(props, value);
                    _this2.emit("next", props, value);
                };
            }

            return this;
        }
    }]);

    return Observer;
}(_events2.default);

;

//  Create an <Observer> from an EXISTING <Observable>
function Create(observable) {
    return new Observer(observable);
};

//  Create an <Observer> from an NON-EXISTING <Observable> via Observable.Create(...args)
function Generate(next) {
    var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var isDeep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    return new Observer(_Observable2.default.Create(next, state, isDeep));
};

Observer.Create = Create;
Observer.Generate = Generate;

exports.default = Observer;