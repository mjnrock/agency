"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

var _Context2 = require("./Context");

var _Context3 = _interopRequireDefault(_Context2);

var _Proposition = require("./Proposition");

var _Proposition2 = _interopRequireDefault(_Proposition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Registry = function (_Context) {
    _inherits(Registry, _Context);

    function Registry() {
        _classCallCheck(this, Registry);

        var _this = _possibleConstructorReturn(this, (Registry.__proto__ || Object.getPrototypeOf(Registry)).call(this, {
            entries: new Map(),
            synonyms: new Map()
        }));

        _this.attach(function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return Registry.Register.apply(Registry, [_this].concat(args));
        }, _Proposition2.default.IsType("register"));
        _this.attach(function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return Registry.Unregister.apply(Registry, [_this].concat(args));
        }, _Proposition2.default.IsType("unregister"));
        _this.attach(function () {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            return Registry.AddSynonym.apply(Registry, [_this].concat(args));
        }, _Proposition2.default.IsType("addSynonym"));
        _this.attach(function () {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            return Registry.RemoveSynonym.apply(Registry, [_this].concat(args));
        }, _Proposition2.default.IsType("removeSynonym"));
        return _this;
    }

    // Convenience invocation methods


    _createClass(Registry, [{
        key: "register",
        value: function register(entry) {
            for (var _len5 = arguments.length, synonyms = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                synonyms[_key5 - 1] = arguments[_key5];
            }

            this.run.apply(this, [["register"], entry].concat(synonyms));
        }
    }, {
        key: "unregister",
        value: function unregister() {
            for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                args[_key6] = arguments[_key6];
            }

            this.run.apply(this, [["unregister"]].concat(args));
        }
    }, {
        key: "addSynonym",
        value: function addSynonym() {
            for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                args[_key7] = arguments[_key7];
            }

            this.run.apply(this, [["addSynonym"]].concat(args));
        }
    }, {
        key: "removeSynonym",
        value: function removeSynonym() {
            for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                args[_key8] = arguments[_key8];
            }

            this.run.apply(this, [["removeSynonym"]].concat(args));
        }
    }, {
        key: "find",
        value: function find() {
            for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                args[_key9] = arguments[_key9];
            }

            return Registry.Find.apply(Registry, [this._state].concat(args));
        }
    }, {
        key: "get",
        value: function get() {
            for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
                args[_key10] = arguments[_key10];
            }

            return Registry.Get.apply(Registry, [this._state].concat(args));
        }
    }, {
        key: "getBySynonym",
        value: function getBySynonym() {
            for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
                args[_key11] = arguments[_key11];
            }

            return Registry.GetBySynonym.apply(Registry, [this._state].concat(args));
        }
    }], [{
        key: "Register",
        value: function Register(registry, state, entry) {
            var eid = (entry || {})._id || (0, _uuid.v4)();

            state.entries.set(eid, entry);

            for (var _len12 = arguments.length, synonyms = Array(_len12 > 3 ? _len12 - 3 : 0), _key12 = 3; _key12 < _len12; _key12++) {
                synonyms[_key12 - 3] = arguments[_key12];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = synonyms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var synonym = _step.value;

                    state.synonyms.set(synonym, eid);
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

            registry.emit.apply(registry, ["addition", eid, entry].concat(synonyms));

            return state;
        }
    }, {
        key: "Unregister",
        value: function Unregister(state, entry) {
            var eid = void 0;
            if ((0, _uuid.validate)(entry)) {
                eid = entry;
            } else {
                eid = entry.id;
            }

            state.entries.delete(eid);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = state.synonyms.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _step2$value = _slicedToArray(_step2.value, 2),
                        syn = _step2$value[0],
                        id = _step2$value[1];

                    if (eid === id) {
                        state.synonyms.delete(syn);
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

            registry.emit("removal", eid, entry);

            return state;
        }
    }, {
        key: "AddSynonym",
        value: function AddSynonym(state, entryOrId) {
            var eid = void 0;
            if ((0, _uuid.validate)(entryOrId)) {
                eid = entryOrId;
            } else {
                eid = entryOrId.id;
            }

            for (var _len13 = arguments.length, synonyms = Array(_len13 > 2 ? _len13 - 2 : 0), _key13 = 2; _key13 < _len13; _key13++) {
                synonyms[_key13 - 2] = arguments[_key13];
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = synonyms[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var synonym = _step3.value;

                    state.synonyms.add(synonym, eid);
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

            return state;
        }
    }, {
        key: "RemoveSynonym",
        value: function RemoveSynonym(state) {
            for (var _len14 = arguments.length, synonyms = Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
                synonyms[_key14 - 1] = arguments[_key14];
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = synonyms[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var synonym = _step4.value;

                    state.synonyms.delete(synonym);
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

            return state;
        }
    }, {
        key: "Find",
        value: function Find(state) {
            var entries = [];

            for (var _len15 = arguments.length, inputs = Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
                inputs[_key15 - 1] = arguments[_key15];
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = inputs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var input = _step5.value;

                    var entry = state.entries.get(input);

                    if (entry !== void 0) {
                        entries.push(entry);
                    } else {
                        var eid = state.synonyms.get(input);

                        if ((0, _uuid.validate)(eid)) {
                            entry = state.entries.get(eid);

                            if (entry !== void 0) {
                                entries.push(entry);
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
        key: "Get",
        value: function Get(state, id) {
            return state.entries.get(id);
        }
    }, {
        key: "GetBySynonym",
        value: function GetBySynonym(state, synonym) {
            var eid = state.synonyms.get(synonym);

            if ((0, _uuid.validate)(eid)) {
                return Registry.Get(state, eid);
            }
        }
    }]);

    return Registry;
}(_Context3.default);

exports.default = Registry;