"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CacheController = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _AgencyBase2 = require("../AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CacheController = exports.CacheController = function (_AgencyBase) {
    _inherits(CacheController, _AgencyBase);

    function CacheController(network, entity, cache) {
        _classCallCheck(this, CacheController);

        var _this = _possibleConstructorReturn(this, (CacheController.__proto__ || Object.getPrototypeOf(CacheController)).call(this));

        _this.eid = (typeof entity === "undefined" ? "undefined" : _typeof(entity)) === "object" ? entity.id || entity._id || entity.__id || entity.uuid : entity;
        _this.dispatch = cache.dispatcher.dispatch;
        _this.broadcast = cache.dispatcher.broadcast;
        _this.receiver = function () {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                callback = _ref.callback,
                filter = _ref.filter;

            var data = network.__connections.get(entity);

            if (!data) {
                return -1; // Cache record does not exist
            }

            var wasUpdated = false;
            if (typeof callback === "function") {
                data.receiver.__callback = callback;
                wasUpdated = true;
            }
            if (typeof filter === "function") {
                data.receiver.__filter = filter;
                wasUpdated = true;
            }

            if (wasUpdated) {
                network.__connections.set(entity, data);

                return true;
            }

            return false;
        };
        _this.leave = function () {
            return network.removeListener(entity);
        };
        return _this;
    }

    return CacheController;
}(_AgencyBase3.default);

;

exports.default = CacheController;