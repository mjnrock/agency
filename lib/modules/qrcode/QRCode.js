"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QRCode = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qrcode = require("qrcode");

var _qrcode2 = _interopRequireDefault(_qrcode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QRCode = exports.QRCode = function () {
    _createClass(QRCode, null, [{
        key: "Generator",
        get: function get() {
            return _qrcode2.default;
        }
    }]);

    function QRCode(data) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : QRCode.OutputType.DATA_URL;
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, QRCode);

        this.type = type;
        this.data = data;
        this.config = _extends({
            errorCorrectionLevel: "H"
        }, opts);
    }

    _createClass(QRCode, [{
        key: "create",
        value: async function create() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var _ref$toTerminal = _ref.toTerminal,
                toTerminal = _ref$toTerminal === undefined ? false : _ref$toTerminal,
                opts = _objectWithoutProperties(_ref, ["toTerminal"]);

            if (toTerminal) {
                return await _qrcode2.default[this.type](this.data, _extends({ type: "terminal" }, this.config, opts)).then(function (data) {
                    return data;
                });
            }

            return await _qrcode2.default[this.type](this.data, _extends({}, this.config, opts)).then(function (data) {
                return data;
            });
        }
    }]);

    return QRCode;
}();

QRCode.OutputType = {
    DATA_URL: "toDataURL",
    CANVAS: "toCanvas",
    STRING: "toString",
    FILE: "toFile",
    FILE_STREAM: "toFileStream",
    BUFFER: "toBuffer"
};
;

exports.default = QRCode;