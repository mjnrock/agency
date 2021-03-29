"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Watchable = exports.wrapNested = exports.WatchableArchetype = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.Factory = Factory;

var _uuid = require("uuid");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WatchableArchetype = exports.WatchableArchetype = function WatchableArchetype() {
    _classCallCheck(this, WatchableArchetype);
};

var wrapNested = exports.wrapNested = function wrapNested(root, prop, input) {
    if (input === null || prop.includes("__")) {
        return input;
    }

    if (input instanceof WatchableArchetype) {
        return input;
    } else if (root instanceof Watchable && input instanceof Watchable) {
        if (root.$.proxy !== input.$.proxy) {
            // Don't broadcast if the input is also the root (e.g. circular references)
            input.$.subscribe(root.$.proxy, prop);
        }

        //FIXME  Watchable{1}.Object.Watchable{2} --> w/ ref to Watchable{1} creates infinite loop (e.g. Entity.Movement.Wayfinder.entity = Entity)

        return input;
    }

    var proxy = new Proxy(input, {
        getPrototypeOf: function getPrototypeOf(t) {
            return WatchableArchetype.prototype;
        },
        get: function get(t, p) {
            return Reflect.get(t, p);
        },
        set: function set(t, p, v) {
            var nprop = prop + "." + p;

            if (t[p] === v) {
                // Ignore if the old value === new value
                return t;
            }

            if (v === null || p[0] === "_" || (Object.getOwnPropertyDescriptor(t, p) || {}).set) {
                // Don't broadcast any _Private/__Internal variables
                return Reflect.defineProperty(t, p, {
                    value: v,
                    configurable: true,
                    writable: true,
                    enumerable: false
                });

                // return Reflect.set(t, p, v);
            }

            if ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
                var ob = wrapNested(root, nprop, v);

                Reflect.set(t, p, ob);
            } else {
                Reflect.set(t, p, v);
            }

            if (!(Array.isArray(input) && p in Array.prototype)) {
                // Don't broadcast native <Array> keys (i.e. .push returns .length)
                root.$.broadcast(nprop, v);
            }

            return t;
        },
        deleteProperty: function deleteProperty(t, p) {
            if (p in t) {
                if (t[p] instanceof Watchable) {
                    t[p].$.unsubscribe(t.$.proxy);
                }

                return Reflect.deleteProperty(t, p);
            }

            return false;
        }
    });

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.entries(input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                var kprop = prop + "." + key;

                proxy[key] = wrapNested(root, kprop, value);
            }
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

    return proxy;
};

var Watchable = exports.Watchable = function () {
    function Watchable() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$deep = _ref.deep,
            deep = _ref$deep === undefined ? true : _ref$deep,
            _ref$only = _ref.only,
            only = _ref$only === undefined ? [] : _ref$only,
            _ref$ignore = _ref.ignore,
            ignore = _ref$ignore === undefined ? [] : _ref$ignore;

        _classCallCheck(this, Watchable);

        var proxy = new Proxy(this, {
            get: function get(target, prop) {
                if ((typeof prop === "string" || prop instanceof String) && prop.includes(".")) {
                    var props = prop.split(".");

                    if (props[0] === "$") {
                        props = props.slice(1);
                    }

                    var result = target;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = props[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var p = _step2.value;

                            if (result[p] !== void 0) {
                                result = result[p];
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

                    if (result !== target) {
                        return result;
                    } else {
                        return;
                    }
                }

                return Reflect.get(target, prop);
            },
            set: function set(target, prop, value) {
                if (target[prop] === value || prop === "$") {
                    // Ignore if the old value === new value, or if accessing get $()
                    return target;
                }

                if (value === null || prop[0] === "_" || (Object.getOwnPropertyDescriptor(target, prop) || {}).set) {
                    // Don't broadcast any _Private/__Internal variables
                    if (prop[0] === "_" && prop[1] === "_") {
                        // Prevent modification of internal variables after first assignment
                        return Reflect.defineProperty(target, prop, {
                            value: value,
                            configurable: false,
                            writable: false,
                            enumerable: false
                        });
                    }

                    return Reflect.defineProperty(target, prop, {
                        value: value,
                        configurable: true,
                        writable: true,
                        enumerable: false
                    });
                    // return Reflect.set(target, prop, value);
                }

                if (deep && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                    var newValue = wrapNested(target, prop, value);

                    Reflect.set(target, prop, newValue);
                    target.$.broadcast(prop, newValue);
                } else {
                    Reflect.set(target, prop, value);
                    target.$.broadcast(prop, value);
                }

                return target;
            },
            deleteProperty: function deleteProperty(target, prop) {
                if (prop in target) {
                    if (target[prop] instanceof Watchable) {
                        target[prop].$.unsubscribe(target.$.proxy);
                    }

                    Reflect.deleteProperty(target, prop);

                    target.$.broadcast(prop, void 0);

                    return true;
                }

                return false;
            }
        });

        proxy.__id = (0, _uuid.v4)();

        proxy.__subscribers = new Map();

        if (only.length || ignore.length) {
            proxy.__filter = {
                type: only.length ? true : ignore.length ? false : null,
                props: only.length ? only : ignore.length ? ignore : []
            };
        }

        //NOTE  Allow @target to regain its <Proxy>, such as in a .broadcast(...) --> { subject: @target } situation
        proxy.__ = { proxy: proxy, target: this }; // Store a proxy and target accessor so that either can access each other

        if ((typeof state === "undefined" ? "undefined" : _typeof(state)) === "object") {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = Object.entries(state)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _step3$value = _slicedToArray(_step3.value, 2),
                        key = _step3$value[0],
                        value = _step3$value[1];

                    proxy[key] = value;
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
        }

        return proxy;
    }

    _createClass(Watchable, [{
        key: Symbol.iterator,
        value: function value() {
            var index = -1;
            var data = Object.entries(this);

            return {
                next: function next() {
                    return { value: data[++index], done: !(index in data) };
                }
            };
        }
    }, {
        key: "$",


        // Method wrapper to easily prevent { key : value } collisions
        get: function get() {
            var _this = this;

            return {
                get ownKeys() {
                    return Reflect.ownKeys(_this);
                },
                get size() {
                    return Object.keys(_this).length;
                },
                get keys() {
                    return Object.keys(_this);
                },
                get values() {
                    return Object.values(_this);
                },

                get id() {
                    return _this.__id;
                },
                get proxy() {
                    return _this.__.proxy;
                },
                get target() {
                    return _this.__.target;
                },

                broadcast: async function broadcast(prop, value) {
                    if (_this.__filter) {
                        if (_this.__filter.type === true) {
                            if (!_this.__filter.props.includes(prop)) {
                                return _this;
                            }
                        } else if (_this.__filter.type === false) {
                            if (_this.__filter.props.includes(prop)) {
                                return _this;
                            }
                        }
                    }

                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = _this.__subscribers.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _step4$value = _slicedToArray(_step4.value, 2),
                                subscriber = _step4$value[0],
                                parentProp = _step4$value[1];

                            /**
                             * @prop | The chain-prop from the original emission
                             * @value | The chain-prop's value from the original emission
                             * @subject | The original .broadcast <Watchable>
                             * @observer | The original subscriber (fn|Watcher) -- The original <Watcher> in a chain emission
                             * @emitter | The emitting <Watchable> -- The final <Watcher> in a chain emission
                             * @subscriber | The subscription fn|Watcher receiving the invocation
                             */
                            var payload = {
                                prop: parentProp != null ? parentProp + "." + prop : prop,
                                value: value,
                                subject: "subject" in this ? this.subject.$.proxy : _this.$.proxy,
                                emitter: _this.$.proxy,
                                subscriber: subscriber instanceof Watchable ? subscriber.$.proxy : subscriber
                            };

                            var finalProp = void 0;
                            if ("__namespace" in payload.subject) {
                                // Proxy evaluation to test if an Emitter
                                if (payload.subject.__namespace === Infinity) {
                                    // Special Case: Emit from local scope
                                    if (Object.keys(payload.subject.__events).includes(prop.slice(prop.lastIndexOf(".") + 1))) {
                                        finalProp = parentProp + ".$" + prop; // Prepend "$" to the event to signify that prop does not exist--it is a scoped event (.e.g "nested.cat" --> "nested.$cat")
                                    } else {
                                        finalProp = payload.prop;
                                    }
                                } else if (Object.keys(payload.subject.__events).includes(prop.slice(prop.lastIndexOf(".") + 1))) {
                                    // A state change in the Emitter (check for event only--namespace removed)
                                    finalProp = prop;
                                } else {
                                    finalProp = payload.prop;
                                }
                            } else {
                                finalProp = payload.prop;
                            }

                            if (typeof subscriber === "function") {
                                subscriber.call(payload, finalProp, value, payload.subject.$.id);
                            } else if (subscriber instanceof Watchable) {
                                subscriber.$.broadcast.call(payload, finalProp, value, payload.subject.$.id);
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

                    return _this;
                },
                purge: function purge() {
                    var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                    _this.__subscribers.clear();

                    if (deep) {
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = Object.entries(_this)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var _step5$value = _slicedToArray(_step5.value, 2),
                                    key = _step5$value[0],
                                    value = _step5$value[1];

                                if (value instanceof Watchable) {
                                    value.$.purge(true);
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
                    }

                    return _this;
                },
                subscribe: function subscribe(input, prop) {
                    if (typeof input === "function") {
                        var uuid = (0, _uuid.v4)();
                        _this.__subscribers.set(uuid, [input, prop]);

                        return uuid;
                    } else if (input instanceof Watchable) {
                        _this.__subscribers.set(input.$.id, [input, prop]);

                        return input.$.id;
                    }

                    return false;
                },
                unsubscribe: function unsubscribe(entryOrId) {
                    if ((0, _uuid.validate)(entryOrId)) {
                        return _this.__subscribers.delete(entryOrId);
                    } else if ((0, _uuid.validate)((entryOrId || {}).__id)) {
                        return _this.__subscribers.delete((entryOrId || {}).__id);
                    }

                    return false;
                },
                toData: function toData() {
                    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                        _ref2$includePrivateK = _ref2.includePrivateKeys,
                        includePrivateKeys = _ref2$includePrivateK === undefined ? false : _ref2$includePrivateK;

                    var obj = {};

                    if ("__arrayLength" in _this) {
                        var arr = [];
                        for (var i = 0; i < _this.__arrayLength; i++) {
                            var entry = _this[i];

                            if (entry instanceof Watchable) {
                                arr.push(entry.$.toData());
                            } else {
                                arr.push(entry);
                            }
                        }

                        return arr;
                    }

                    if (includePrivateKeys) {
                        var _iteratorNormalCompletion6 = true;
                        var _didIteratorError6 = false;
                        var _iteratorError6 = undefined;

                        try {
                            for (var _iterator6 = Object.entries(_this)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                var _step6$value = _slicedToArray(_step6.value, 2),
                                    key = _step6$value[0],
                                    value = _step6$value[1];

                                if (!(key[0] === "_" && key[1] === "_")) {
                                    if (value instanceof Watchable) {
                                        obj[key] = value.$.toData();
                                    } else {
                                        obj[key] = value;
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

                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = Object.entries(_this)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var _step7$value = _slicedToArray(_step7.value, 2),
                                key = _step7$value[0],
                                value = _step7$value[1];

                            if (key[0] !== "_") {
                                if (value instanceof Watchable) {
                                    obj[key] = value.$.toData();
                                } else {
                                    obj[key] = value;
                                }
                            }
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

                    return obj;
                }
            };
        }
    }]);

    return Watchable;
}();

;

function Factory(state) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new Watchable(state, opts);
};

Watchable.Factory = Factory;

exports.default = Watchable;

// import { v4 as uuidv4 } from "uuid";

// export const WatchableArchetype = class {};

// export const wrapNested = (root, prop, input, nestedProps) => {
//     if(input === null || prop.includes("__")) {
//         return input;
//     }

//     if(input instanceof WatchableArchetype) {
//         return input;
//     } else if(root instanceof Watchable && input instanceof Watchable) {
//         if(root.$.proxy !== input.$.proxy) {    // Don't broadcast if the input is also the root (e.g. circular references)
//             input.$.subscribe(root.$.proxy, prop);
//         }

//         //FIXME  Watchable{1}.Object.Watchable{2} --> w/ ref to Watchable{1} creates infinite loop (e.g. Entity.Movement.Wayfinder.entity = Entity)

//         return input;
//     }

//     const proxy = new Proxy(input, {
//         getPrototypeOf(t) {
//             return WatchableArchetype.prototype;
//         },
//         get(t, p) {
//             return t[ p ];
//         },
//         set(t, p, v) {
//             if(t[ p ] === v) {  // Ignore if the old value === new value
//                 return t;
//             }

//             if(v === null || p[ 0 ] === "_" || (Object.getOwnPropertyDescriptor(t, p) || {}).set) {      // Don't broadcast any _Private/__Internal variables
//                 t[ p ] = v;

//                 return t;
//             }

//             if(typeof v === "object") {
//                 let ob = wrapNested(root, nestedProps ? `${ prop }.${ p }` : p, v, nestedProps);

//                 t[ p ] = ob;
//             } else {
//                 t[ p ] = v;
//             }

//             if(!(Array.isArray(input) && p in Array.prototype)) {   // Don't broadcast native <Array> keys (i.e. .push returns .length)
//                 root.$.broadcast(nestedProps ? `${ prop }.${ p }` : p, v);
//             }

//             return t;
//         },
//         // deleteProperty(t, p) {
//         //     if(p in t) {
//         //         delete t[ p ];

//         //         t.$.broadcast(p, void 0);
//         //     }
//         // }
//     });

//     for(let [ key, value ] of Object.entries(input)) {
//         if(typeof value === "object") {
//             // proxy[ key ] = wrapNested(root, prop, value, nestedProps);
//             proxy[ key ] = value;//wrapNested(root, prop, value, nestedProps);
//         }
//     }

//     return proxy;
// };

// export class Watchable {
//     constructor(state = {}, { deep = true, only = [], ignore = [], nestedProps = true } = {}) {
//         this.__id = uuidv4();

//         this.__subscribers = new Map();

//         if(only.length || ignore.length) {
//             this.__filter = {
//                 type: only.length ? true : (ignore.length ? false : null),
//                 props: only.length ? only : (ignore.length ? ignore : []),
//             };
//         }

//         const proxy = new Proxy(this, {
//             get(target, prop) {
//                 if((typeof prop === "string" || prop instanceof String) && prop.includes(".")) {
//                     let props = prop.split(".");

//                     if(props[ 0 ] === "$") {
//                         props = props.slice(1);
//                     }

//                     let result = target;
//                     for(let p of props) {
//                         if(result[ p ] !== void 0) {
//                             result = result[ p ];
//                         }
//                     }

//                     if(result !== target) {
//                         return result;
//                     } else {
//                         return;
//                     }
//                 }

//                 return target[ prop ];
//             },
//             set(target, prop, value) {
//                 if(target[ prop ] === value || prop === "$") {  // Ignore if the old value === new value, or if accessing get $()
//                     return target;
//                 }

//                 if(value === null || prop[ 0 ] === "_" || (Object.getOwnPropertyDescriptor(target, prop) || {}).set) {      // Don't broadcast any _Private/__Internal variables
//                     target[ prop ] = value;

//                     return target;
//                 }

//                 if(deep && typeof value === "object") {
//                     target[ prop ] = wrapNested(target, prop, value, nestedProps);

//                     target.$.broadcast(prop, target[ prop ]);
//                 } else {
//                     target[ prop ] = value;

//                     target.$.broadcast(prop, value);
//                 }

//                 return target;
//             },
//             // deleteProperty(target, prop) {
//             //     if(prop in target) {
//             //         delete target[ prop ];

//             //         target.$.broadcast(prop, void 0);
//             //     }
//             // }
//         });

//         //NOTE  Allow @target to regain its <Proxy>, such as in a .broadcast(...) --> { subject: @target } situation
//         this.__ = { proxy: proxy, target: this };  // Store a proxy and target accessor so that either can access each other

//         if(typeof state === "object") {
//             for(let [ key, value ] of Object.entries(state)) {
//                 proxy[ key ] = value;
//             }
//         }

//         return proxy;
//     }

//     // Method wrapper to easily prevent { key : value } collisions
//     get $() {
//         const _this = this;

//         return {
//             get id() {
//                 return _this.__id;
//             },
//             get proxy() {
//                 return _this.__.proxy;
//             },
//             get target() {
//                 return _this.__.target;
//             },

//             async broadcast(prop, value) {
//                 if(_this.__filter) {
//                     if(_this.__filter.type === true) {
//                         if(!_this.__filter.props.includes(prop)) {
//                             return _this;
//                         }
//                     } else if(_this.__filter.type === false) {
//                         if(_this.__filter.props.includes(prop)) {
//                             return _this;
//                         }
//                     }
//                 }

//                 for(let [ subscriber, nestedProp ] of _this.__subscribers.values()) {
//                     /**
//                      * @prop | The chain-prop from the original emission
//                      * @value | The chain-prop's value from the original emission
//                      * @subject | The original .broadcast <Watchable>
//                      * @observer | The original subscriber (fn|Watcher) -- The original <Watcher> in a chain emission
//                      * @emitter | The emitting <Watchable> -- The final <Watcher> in a chain emission
//                      * @subscriber | The subscription fn|Watcher receiving the invocation
//                      */
//                     const payload = {
//                         prop: nestedProp != null  ? `${ nestedProp }.${ prop }` : prop,
//                         // prop,
//                         value,
//                         subject: "subject" in this ? this.subject.$.proxy : _this.$.proxy,
//                         emitter: _this.$.proxy,
//                         subscriber: subscriber instanceof Watchable ? subscriber.$.proxy : subscriber,
//                     };

//                     if(typeof subscriber === "function") {
//                         subscriber.call(payload, prop, value, payload.subject.$.id);
//                     } else if(subscriber instanceof Watchable) {
//                         subscriber.$.broadcast.call(payload, payload.prop, value, payload.subject.$.id);
//                     }
//                 }

//                 return _this;
//             },

//             purge(deep = false) {
//                 _this.__subscribers.clear();

//                 if(deep) {
//                     for(let [ key, value ] of Object.entries(_this)) {
//                         if(value instanceof Watchable) {
//                             value.$.purge(true);
//                         }
//                     }
//                 }

//                 return _this;
//             },

//             subscribe(input, prop) {
//                 if(typeof input === "function") {
//                     const uuid = uuidv4();
//                     _this.__subscribers.set(uuid, [ input, prop ]);

//                     return uuid;
//                 } else if(input instanceof Watchable) {
//                     _this.__subscribers.set(input.$.id, [ input, prop ]);

//                     return input.$.id;
//                 }

//                 return false;
//             },
//             unsubscribe(id) {
//                 return _this.__subscribers.delete(id);
//             },

//             toData({ includePrivateKeys = false } = {}) {
//                 const obj = {};

//                 if("__arrayLength" in _this) {
//                     const arr = [];
//                     for(let i = 0; i < _this.__arrayLength; i++) {
//                         const entry = _this[ i ];

//                         if(entry instanceof Watchable) {
//                             arr.push(entry.$.toData());
//                         } else {
//                             arr.push(entry);
//                         }
//                     }

//                     return arr;
//                 }

//                 if(includePrivateKeys) {
//                     for(let [ key, value ] of Object.entries(_this)) {
//                         if(!(key[ 0 ] === "_" && key[ 1 ] === "_")) {
//                             if(value instanceof Watchable) {
//                                 obj[ key ] = value.$.toData();
//                             } else {
//                                 obj[ key ] = value;
//                             }
//                         }
//                     }

//                     return obj;
//                 }

//                 for(let [ key, value ] of Object.entries(_this)) {
//                     if(key[ 0 ] !== "_") {
//                         if(value instanceof Watchable) {
//                             obj[ key ] = value.$.toData();
//                         } else {
//                             obj[ key ] = value;
//                         }
//                     }
//                 }

//                 return obj;
//             },
//         }
//     }
// };

// export function Factory(state, opts = {}) {
//     return new Watchable(state, opts);
// };

// Watchable.Factory = Factory;

// export default Watchable;