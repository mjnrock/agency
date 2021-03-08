"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.CreateGrid = CreateGrid;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CrossMap = exports.CrossMap = function () {
    function CrossMap() {
        var dimensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            seedFn = _ref.seedFn,
            saveFnInstead = _ref.saveFnInstead;

        _classCallCheck(this, CrossMap);

        this.__entries = new Map();
        this.__lookups = [];

        this.seed({ dimensions: dimensions, seedFn: seedFn, saveFnInstead: saveFnInstead });
    }

    _createClass(CrossMap, [{
        key: "addLookup",
        value: function addLookup(fn) {
            this.__lookups.push(fn);

            return this;
        }
    }, {
        key: "setLookup",
        value: function setLookup(index, fn) {
            this.__lookups[index] = fn;

            return this;
        }
    }, {
        key: "getLookup",
        value: function getLookup(index) {
            return this.__lookups[index];
        }
    }, {
        key: "reorderLookup",
        value: function reorderLookup(i1, i2) {
            var temp = this.getLookup(i1);

            this.setLookup(i1, this.getLookup(i2));
            this.setLookup(i2, temp);

            return this;
        }
    }, {
        key: "__dive",
        value: function __dive() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (args.length === 1 && _typeof(args[0]) === "object") {
                // Assume "lookup" utilization
                var _coords = [];
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.__lookups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var fn = _step.value;

                        _coords.push(fn(args[0]));
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

                return this.get.apply(this, _coords);
            }

            // Assume @args are entries
            var coords = [];
            for (var i = 0; i < this.__lookups.length; i++) {
                var _fn = this.__lookups[i];

                if (Array.isArray(args[i])) {
                    coords.push(_fn.apply(undefined, _toConsumableArray(args[i])));
                } else {
                    coords.push(_fn());
                }
            }

            return this.get.apply(this, coords);
        }
    }, {
        key: "get",
        value: function get() {
            for (var _len2 = arguments.length, coords = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                coords[_key2] = arguments[_key2];
            }

            if (_typeof(coords[0]) === "object") {
                // Assume "lookup" utilization
                return this.__dive(coords[0]);
            }

            // Assume @args are entries
            var result = this.__entries;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = coords[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var coord = _step2.value;

                    if (result instanceof Map) {
                        result = result.get(coord);
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

            return result;
        }
    }, {
        key: "__setDive",
        value: function __setDive(value) {
            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            if (args.length === 1 && _typeof(args[0]) === "object") {
                // Assume "lookup" utilization
                var _coords2 = [];
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this.__lookups[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var fn = _step3.value;

                        _coords2.push(fn(args[0]));
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

                return this.set.apply(this, [value].concat(_coords2));
            }

            // Assume @args are entries
            var coords = [];
            for (var i = 0; i < this.__lookups.length; i++) {
                var _fn2 = this.__lookups[i];

                if (Array.isArray(args[i])) {
                    coords.push(_fn2.apply(undefined, _toConsumableArray(args[i])));
                } else {
                    coords.push(_fn2());
                }
            }

            return this.set.apply(this, [value].concat(coords));
        }
    }, {
        key: "set",
        value: function set(value) {
            for (var _len4 = arguments.length, coords = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                coords[_key4 - 1] = arguments[_key4];
            }

            if (_typeof(coords[0]) === "object") {
                // Assume "lookup" utilization
                return this.__setDive(value, coords[0]);
            }

            // Assume @args are entries
            var map = this.get.apply(this, _toConsumableArray(coords.slice(0, coords.length - 1)));

            map.set(coords[coords.length - 1], value);

            return this;
        }
    }, {
        key: "seed",
        value: function seed() {
            var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                root = _ref2.root,
                _ref2$dimensions = _ref2.dimensions,
                dimensions = _ref2$dimensions === undefined ? [] : _ref2$dimensions,
                _ref2$chain = _ref2.chain,
                chain = _ref2$chain === undefined ? [] : _ref2$chain,
                _ref2$seedFn = _ref2.seedFn,
                seedFn = _ref2$seedFn === undefined ? null : _ref2$seedFn,
                _ref2$saveFnInstead = _ref2.saveFnInstead,
                saveFnInstead = _ref2$saveFnInstead === undefined ? false : _ref2$saveFnInstead;

            if (root === void 0) {
                root = this.__entries = new Map();
                chain = [];
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = dimensions[0][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var value = _step4.value;

                    if (dimensions.length > 1) {
                        var map = new Map();
                        root.set(value, this.seed({
                            root: map,
                            dimensions: dimensions.slice(1),
                            seedFn: seedFn,
                            saveFnInstead: saveFnInstead,
                            chain: [].concat(_toConsumableArray(chain), [value])
                        }));
                    } else {
                        if (typeof seedFn === "function" && !saveFnInstead) {
                            root.set(value, seedFn.apply(undefined, _toConsumableArray(chain).concat([value])));
                        } else {
                            root.set(value, seedFn);
                        }
                    }
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

            return root;
        }
    }, {
        key: "toLeaf",
        value: function toLeaf() {
            var asObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var rootMap = arguments[1];

            if (rootMap === void 0) {
                rootMap = this.__entries;
            } else if (typeof rootMap === "boolean") {
                asObject = rootMap;
                rootMap = this.__entries;
            }

            if (asObject) {
                var obj = {};
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = rootMap.entries()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var _step5$value = _slicedToArray(_step5.value, 2),
                            key = _step5$value[0],
                            value = _step5$value[1];

                        if (value instanceof Map) {
                            obj[key] = this.toLeaf(true, value);
                        } else {
                            obj[key] = value;
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

                return obj;
            }

            var arr = [];
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = rootMap.entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var _step6$value = _slicedToArray(_step6.value, 2),
                        key = _step6$value[0],
                        value = _step6$value[1];

                    if (value instanceof Map) {
                        arr.push(this.toLeaf(false, value));
                    } else {
                        arr.push(value);
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

            return arr;
        }
    }]);

    return CrossMap;
}();

function CreateGrid() {
    var dimLengths = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var dims = dimLengths.map(function (v) {
        return [].concat(_toConsumableArray(Array(v))).map(function (v, i) {
            return i;
        });
    });

    return new CrossMap(dims, opts);
}

CrossMap.CreateGrid = CreateGrid;

exports.default = CrossMap;