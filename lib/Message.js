"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Message = function () {
    function Message(type, payload) {
        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            id = _ref.id,
            timestamp = _ref.timestamp;

        _classCallCheck(this, Message);

        this._id = id || (0, _uuid.v4)();
        this._timestamp = timestamp || Date.now();

        this.type = type;
        this.data = payload;
    }

    _createClass(Message, null, [{
        key: "ToObject",
        value: function ToObject(msg) {
            if (!(msg instanceof Message)) {
                return false;
            }

            return {
                _id: msg._id,
                _timestamp: msg._timestamp,
                type: msg.type,
                data: msg.data
            };
        }
    }, {
        key: "FromObject",
        value: function FromObject(obj) {
            if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object") {
                return false;
            }

            if (!("data" in obj && "type" in obj)) {
                return false;
            }

            return new Message(obj.type, obj.data, { id: obj._id, timestamp: obj._timestamp });
        }
    }]);

    return Message;
}();

exports.default = Message;