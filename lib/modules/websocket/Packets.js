"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var NodeJson = exports.NodeJson = function NodeJson() {
    return {
        packer: function packer(event) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            return JSON.stringify({
                type: event,
                payload: args,
                timestamp: Date.now()
            });
        },
        unpacker: function unpacker(json) {
            var obj = JSON.parse(json);

            while (typeof obj === "string" || obj instanceof String) {
                obj = JSON.parse(obj);
            }

            return obj;
        }
    };
};

var BrowserJson = exports.BrowserJson = function BrowserJson() {
    return {
        packer: function packer(event) {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            return JSON.stringify({
                type: event,
                payload: args,
                timestamp: Date.now()
            });
        },
        unpacker: function unpacker(_ref) {
            var json = _ref.data;

            var obj = JSON.parse(json);

            while (typeof obj === "string" || obj instanceof String) {
                obj = JSON.parse(obj);
            }

            return obj;
        }
    };
};

/**
 * NOTE:    **ALL** arguments will get cast as a string
 * This will encode the inner data according to the @encoding,
 *  but will convert the result into a UTF-8 buffer.  On the
 *  other side, the UTF-8 buffer will be converted to a string,
 *  then enc
 */
var StringBuffer = exports.StringBuffer = function StringBuffer() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$encoding = _ref2.encoding,
        encoding = _ref2$encoding === undefined ? "utf8" : _ref2$encoding,
        _ref2$spacer = _ref2.spacer,
        spacer = _ref2$spacer === undefined ? ":" : _ref2$spacer;

    return {
        packer: function packer(event) {
            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            return Buffer.from([event].concat(args).join(spacer).toString(), encoding);
        },
        unpacker: function unpacker(buffer) {
            if (buffer instanceof Buffer) {
                var str = Buffer.from(buffer, encoding).toString(encoding);

                var _str$split = str.split(spacer),
                    _str$split2 = _toArray(_str$split),
                    event = _str$split2[0],
                    _args = _str$split2.slice(1);

                return {
                    type: event,
                    data: _args
                };
            }

            return new String();
        }
    };
};

exports.default = {
    BrowserJson: BrowserJson,
    NodeJson: NodeJson,
    StringBuffer: StringBuffer
};