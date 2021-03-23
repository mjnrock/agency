"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Watcher = undefined;
exports.Factory = Factory;
exports.SubjectFactory = SubjectFactory;

var _Watchable2 = require("./Watchable");

var _Watchable3 = _interopRequireDefault(_Watchable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Watcher = exports.Watcher = function (_Watchable) {
    _inherits(Watcher, _Watchable);

    function Watcher() {
        var watchables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, Watcher);

        var _this = _possibleConstructorReturn(this, (Watcher.__proto__ || Object.getPrototypeOf(Watcher)).call(this, state, opts));

        if (watchables instanceof _Watchable3.default) {
            watchables.$.subscribe(_this);
        } else if (Array.isArray(watchables)) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = watchables[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var watchable = _step.value;

                    watchable.$.subscribe(_this);
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
        }
        return _this;
    }

    return Watcher;
}(_Watchable3.default);

;

function Factory(watchables, state) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return new Watcher(watchables, state, opts);
};
function SubjectFactory(state) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new Watcher(_Watchable3.default.Factory(state, opts));
};

Watcher.Factory = Factory;
Watcher.SubjectFactory = SubjectFactory;

exports.default = Watcher;