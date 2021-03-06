"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Message = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Message = exports.Message = function () {
    function Message(emitter, type) {
        _classCallCheck(this, Message);

        this.id = (0, _uuid.v4)();
        this.type = type;

        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
        }

        this.data = args;
        this.emitter = (0, _uuid.validate)(emitter) ? emitter : emitter.id;
        this.tags = new Set([emitter.id]);
        this.timestamp = Date.now();

        //  Basic proxy traps to prevent direct reassignment, but doesn't prevent nested object modification (e.g. tags)
        return new Proxy(this, {
            get: function get(target, prop) {
                return Reflect.get(target, prop);
            },
            set: function set(target, prop, value) {
                return Reflect.set(target, prop, target[prop]);
            }
        });
    }

    _createClass(Message, [{
        key: "addTag",
        value: function addTag() {
            for (var _len2 = arguments.length, tags = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                tags[_key2] = arguments[_key2];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = tags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var tag = _step.value;

                    this.tags.add(tag);
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

            return [].concat(_toConsumableArray(this.tags));
        }
    }, {
        key: "isFrom",
        value: function isFrom(potentialEmitter) {
            if ((typeof potentialEmitter === "undefined" ? "undefined" : _typeof(potentialEmitter)) === "object") {
                return this.emitter === potentialEmitter.id;
            }

            return false;
        }
    }, {
        key: "toObject",
        value: function toObject() {
            return Object.assign({}, this);
        }
    }, {
        key: "toJson",
        value: function toJson() {
            return JSON.stringify(this.toObject());
        }
    }, {
        key: "getHash",
        value: function getHash() {
            var algorithm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "md5";
            var digest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hex";

            return _crypto2.default.createHash(algorithm).update(JSON.stringify([this.getDataHash(algorithm, digest), this.getMetaHash(algorithm, digest)])).digest(digest);
        }
    }, {
        key: "getDataHash",
        value: function getDataHash() {
            var algorithm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "md5";
            var digest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hex";

            return _crypto2.default.createHash(algorithm).update(JSON.stringify({
                type: this.type,
                data: this.data,
                timestamp: this.timestamp
            })).digest(digest);
        }
    }, {
        key: "getMetaHash",
        value: function getMetaHash() {
            var algorithm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "md5";
            var digest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hex";

            return _crypto2.default.createHash(algorithm).update(JSON.stringify({
                id: this.id,
                tags: [].concat(_toConsumableArray(this.tags)).reduce(function (a, v) {
                    var id = void 0;
                    if ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
                        if ("id" in v) {
                            id = v.id;
                        } else if ("uuid" in v) {
                            id = v.uuid;
                        } else if ("_id" in v) {
                            id = v._id;
                        } else if ("_uuid" in v) {
                            id = v._uuid;
                        } else if ("__id" in v) {
                            id = v.__id;
                        } else if ("__uuid" in v) {
                            id = v.__uuid;
                        }

                        if (typeof id === "function") {
                            id = id();
                        }

                        if (id !== void 0) {
                            return [].concat(_toConsumableArray(a), [v]);
                        }
                    }

                    return a;
                }, []),
                timestamp: this.timestamp
            })).digest(digest);
        }
    }], [{
        key: "Generate",
        value: function Generate(emitter, type) {
            if (Message.Conforms(emitter)) {
                return new (Function.prototype.bind.apply(Message, [null].concat([emitter.emitter, emitter.type], _toConsumableArray(emitter.data))))();
            } else if (Message.Conforms(type)) {
                return new (Function.prototype.bind.apply(Message, [null].concat([emitter, type.type], _toConsumableArray(type.data))))();
            }

            for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                args[_key3 - 2] = arguments[_key3];
            }

            return new (Function.prototype.bind.apply(Message, [null].concat([emitter, type], args)))();
        }
    }, {
        key: "Conforms",
        value: function Conforms(obj) {
            if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object") {
                return false;
            }

            return "id" in obj && "type" in obj && "data" in obj && "emitter" in obj && "tags" in obj && "timestamp" in obj;
        }
    }, {
        key: "ConformsBasic",
        value: function ConformsBasic(obj) {
            if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object") {
                return false;
            }

            return "type" in obj && "data" in obj && "emitter" in obj;
        }
    }, {
        key: "FromObject",
        value: function FromObject(obj) {
            return Message.FromJson(obj);
        }
    }, {
        key: "FromJson",
        value: function FromJson(json) {
            var maxDepth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

            try {
                var obj = json;

                var i = 0;
                while ((typeof obj === "string" || obj instanceof String) && i < maxDepth) {
                    obj = JSON.parse(json);
                    ++i;
                }

                var message = new (Function.prototype.bind.apply(Message, [null].concat([obj.emitter, obj.type], _toConsumableArray(obj.data))))();
                message.id = obj.id;
                message.tags = new Set(obj.tags);
                message.timestamp = obj.timestamp;

                return message;
            } catch (e) {}

            return false;
        }
    }]);

    return Message;
}();

;

exports.default = Message;