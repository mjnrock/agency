"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

var _Context2 = require("./Context");

var _Context3 = _interopRequireDefault(_Context2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Registry = function (_Context) {
    _inherits(Registry, _Context);

    function Registry() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ret;

        var evaluators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, Registry);

        var _this = _possibleConstructorReturn(this, (Registry.__proto__ || Object.getPrototypeOf(Registry)).call(this, _extends({
            entries: new Map(),
            synonyms: new Map()
        }, state), evaluators));

        return _ret = new Proxy(_this, {
            get: function get(target, prop, receiver) {
                if (prop in target) {
                    return target[prop];
                } else if (target instanceof Registry) {
                    var value = target.getBySynonym(prop);

                    if (value === void 0) {
                        value = target.get(prop);
                    }

                    if (value !== void 0) {
                        return value;
                    }
                }

                return Reflect.get.apply(Reflect, arguments);
            },
            set: function set(target, prop, value) {
                if (target instanceof Registry) {
                    var _eid = target._state.synonyms.get(prop);

                    if ((0, _uuid.validate)(_eid)) {
                        target._state.entries.set(_eid, value);

                        target.emit("update", target._state, [false, _eid, value]);
                    }
                }

                return Reflect.set.apply(Reflect, arguments);
            }
        }), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Registry, [{
        key: "_",


        /**
         * Helper function to dive through nested <Registry>
         */
        value: function _(nestedKey) {
            var keys = nestedKey.split(".");
            var entry = this.get(keys.shift());

            if (entry !== void 0) {
                if (entry instanceof Registry) {
                    return entry._(keys);
                } else if ((typeof entry === "undefined" ? "undefined" : _typeof(entry)) === "object" && keys[0] in entry) {
                    return entry._(keys);
                } else if (Array.isArray(entry)) {
                    return entry._(keys)[+keys[0]];
                }

                return entry;
            }

            // let keys = Array.isArray(nestedKey) ? nestedKey : nestedKey.split(".");
            // let key = keys.shift();
            // const entry = this._state.entries.getBySynonym(key);

            // if(entry instanceof Registry) {
            //     return entry._(keys);
            // }

            // return entry;
        }
    }, {
        key: "register",
        value: function register(entry) {
            var _this2 = this;

            var eid = (entry || {})._id || (0, _uuid.v4)();

            this._state.entries.set(eid, entry);

            //TODO  Code a bubbling version of this
            if (entry instanceof _Context3.default) {
                entry.on("update", function () {
                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    return _this2.emit.apply(_this2, ["update", eid, entry].concat(args));
                });
            }

            for (var _len = arguments.length, synonyms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                synonyms[_key - 1] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = synonyms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var synonym = _step.value;

                    this._state.synonyms.set(synonym, eid);
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

            this.run.apply(this, ["addition", eid, entry].concat(synonyms));

            return this._state;
        }
    }, {
        key: "unregister",
        value: function unregister(entry) {
            var eid = void 0;
            if ((0, _uuid.validate)(entry)) {
                eid = entry;
            } else {
                eid = entry.id;
            }

            this._state.entries.delete(eid);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._state.synonyms.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _step2$value = _slicedToArray(_step2.value, 2),
                        syn = _step2$value[0],
                        id = _step2$value[1];

                    if (eid === id) {
                        this._state.synonyms.delete(syn);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.run("removal", eid, entry);

            return this._state;
        }
    }, {
        key: "addSynonym",
        value: function addSynonym(entryOrId) {
            var eid = void 0;
            if ((0, _uuid.validate)(entryOrId)) {
                eid = entryOrId;
            } else {
                eid = entryOrId.id;
            }

            for (var _len3 = arguments.length, synonyms = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                synonyms[_key3 - 1] = arguments[_key3];
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = synonyms[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var synonym = _step3.value;

                    this._state.synonyms.add(synonym, eid);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            this.run("addition:synonym", eid, entry);

            return this._state;
        }
    }, {
        key: "removeSynonym",
        value: function removeSynonym() {
            for (var _len4 = arguments.length, synonyms = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                synonyms[_key4] = arguments[_key4];
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = synonyms[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var synonym = _step4.value;

                    this._state.synonyms.delete(synonym);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            this.run("removal:synonym", eid, entry);

            return this._state;
        }
    }, {
        key: "find",
        value: function find() {
            var entries = [];

            for (var _len5 = arguments.length, inputs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                inputs[_key5] = arguments[_key5];
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = inputs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var input = _step5.value;

                    var _entry = this._state.entries.get(input);

                    if (_entry !== void 0) {
                        entries.push(_entry);
                    } else {
                        var _eid2 = this._state.synonyms.get(input);

                        if ((0, _uuid.validate)(_eid2)) {
                            _entry = this._state.entries.get(_eid2);

                            if (_entry !== void 0) {
                                entries.push(_entry);
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            if (entries.length === 0) {
                return;
            } else if (entries.length === 1) {
                return entries[0];
            }

            return entries;
        }
    }, {
        key: "get",
        value: function get(idOrSyn) {
            var eid = this._state.synonyms.get(idOrSyn);

            if ((0, _uuid.validate)(eid)) {
                return this._state.entries.get(eid);
            } else if ((0, _uuid.validate)(idOrSyn)) {
                return this._state.entries.get(idOrSyn);
            }
        }
    }, {
        key: "getById",
        value: function getById(id) {
            return this._state.entries.get(id);
        }
    }, {
        key: "getBySynonym",
        value: function getBySynonym(synonym) {
            var eid = this._state.synonyms.get(synonym);

            if ((0, _uuid.validate)(eid)) {
                return this.get(eid);
            }
        }
    }, {
        key: "toObject",
        value: function toObject() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref$recursive = _ref.recursive,
                recursive = _ref$recursive === undefined ? true : _ref$recursive,
                _ref$synonymsOnly = _ref.synonymsOnly,
                synonymsOnly = _ref$synonymsOnly === undefined ? true : _ref$synonymsOnly;

            var obj = {};
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this._state.synonyms.entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var _step6$value = _slicedToArray(_step6.value, 2),
                        syn = _step6$value[0],
                        id = _step6$value[1];

                    var _entry2 = this._state.entries.get(id);

                    if (recursive === true) {
                        if (_entry2 instanceof Registry) {
                            obj[syn] = _entry2.toObject();

                            if (synonymsOnly === false) {
                                obj[id] = _entry2.toObject();
                            }
                        } else {
                            obj[syn] = _entry2;

                            if (synonymsOnly === false) {
                                obj[id] = _entry2.toObject();
                            }
                        }
                    } else {
                        obj[syn] = _entry2;

                        if (synonymsOnly === false) {
                            obj[id] = _entry2;
                        }
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return obj;
        }
    }, {
        key: "state",
        get: function get() {
            var state = _extends({}, Object.fromEntries(Array.from(this._state.entries.entries()).map(function (_ref2) {
                var _ref3 = _slicedToArray(_ref2, 2),
                    id = _ref3[0],
                    entry = _ref3[1];

                if (entry instanceof _Context3.default) {
                    return [id, entry.state];
                }

                return [id, entry];
            })));

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = this._state.synonyms.entries()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _step7$value = _slicedToArray(_step7.value, 2),
                        syn = _step7$value[0],
                        id = _step7$value[1];

                    state[syn] = state[id];
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            return state;
        }
    }, {
        key: "entries",
        get: function get() {
            return [].concat(_toConsumableArray(this._state.entries.entries()));
        }
    }, {
        key: "values",
        get: function get() {
            return [].concat(_toConsumableArray(this._state.entries.values()));
        }
    }]);

    return Registry;
}(_Context3.default);

exports.default = Registry;