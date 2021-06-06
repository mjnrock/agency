"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Deck = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AgencyBase2 = require("./../../AgencyBase");

var _AgencyBase3 = _interopRequireDefault(_AgencyBase2);

var _Registry = require("./../../Registry");

var _Registry2 = _interopRequireDefault(_Registry);

var _Card = require("./Card");

var _Card2 = _interopRequireDefault(_Card);

var _CardCollection = require("./CardCollection");

var _CardCollection2 = _interopRequireDefault(_CardCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Deck = exports.Deck = function (_AgencyBase) {
	_inherits(Deck, _AgencyBase);

	function Deck() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$cards = _ref.cards,
		    cards = _ref$cards === undefined ? [] : _ref$cards,
		    _ref$shuffle = _ref.shuffle,
		    shuffle = _ref$shuffle === undefined ? false : _ref$shuffle,
		    _ref$collections = _ref.collections,
		    collections = _ref$collections === undefined ? [] : _ref$collections;

		_classCallCheck(this, Deck);

		var _this = _possibleConstructorReturn(this, (Deck.__proto__ || Object.getPrototypeOf(Deck)).call(this));

		_this.cards = new _Registry2.default();
		_this.collections = {
			deck: new _CardCollection2.default({ deck: _this }),
			discard: new _CardCollection2.default({ deck: _this })
		};

		_this.addCards(cards, "deck");
		_this.addCollections(collections);

		for (var i = 0; i < +shuffle; i++) {
			_this.shuffle();
		}
		return _this;
	}

	_createClass(Deck, [{
		key: Symbol.iterator,
		value: function value() {
			var index = -1;
			var data = Object.entries(this.cards);

			return {
				next: function next() {
					return { value: data[++index], done: !(index in data) };
				}
			};
		}
	}, {
		key: "addCollections",
		value: function addCollections() {
			var _this2 = this;

			for (var _len = arguments.length, collections = Array(_len), _key = 0; _key < _len; _key++) {
				collections[_key] = arguments[_key];
			}

			if (Array.isArray(collections[0])) {
				this.collections = _extends({}, this.collections, Object.fromEntries(collections[0].map(function (name) {
					return [name, new _CardCollection2.default({ deck: _this2 })];
				})));
			} else if (_typeof(collections[0]) === "object") {
				this.collections = _extends({}, this.collections, collections[0]);
			} else {
				this.collections = _extends({}, this.collections, Object.fromEntries(collections.map(function (name) {
					return [name, new _CardCollection2.default({ deck: _this2 })];
				})));
			}

			return this;
		}
	}, {
		key: "removeCollections",
		value: function removeCollections() {
			var obj = Object.entries(this.collections);

			for (var _len2 = arguments.length, collections = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				collections[_key2] = arguments[_key2];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = collections[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var entry = _step.value;

					if (typeof entry === "string" || entry instanceof String) {
						delete obj[entry];
					} else if (entry instanceof _CardCollection2.default) {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = Object.entries(this.collections)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var _step2$value = _slicedToArray(_step2.value, 2),
								    key = _step2$value[0],
								    value = _step2$value[1];

								if (value === entry) {
									delete obj[key];
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

			this.collections = obj;

			return this;
		}
	}, {
		key: "addCards",
		value: function addCards() {
			var cards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var collection = arguments[1];

			if (!Array.isArray(cards)) {
				cards = [cards];
			}

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = cards[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var card = _step3.value;

					if (card instanceof _CardCollection2.default) {
						this.addCards(card.cards, collection);
					} else if (card instanceof _Card2.default) {
						card._deck = this;

						this.cards.register(card);
					}
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

			if (collection) {
				var _collections$collecti;

				(_collections$collecti = this.collections[collection]).add.apply(_collections$collecti, _toConsumableArray(cards));
			}

			return this;
		}
	}, {
		key: "removeCards",
		value: function removeCards() {
			var cards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var collection = arguments[1];

			if (!Array.isArray(cards)) {
				cards = [cards];
			}

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = cards[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var card = _step4.value;

					if (card instanceof _CardCollection2.default) {
						this.removeCards(card.cards, collection);
					} else if (card instanceof _Card2.default) {
						card._deck = null;

						this.cards.unregister(card);
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

			if (collection) {
				var _collections$collecti2;

				(_collections$collecti2 = this.collections[collection]).remove.apply(_collections$collecti2, _toConsumableArray(cards));
			}

			return this;
		}
	}, {
		key: "moveCards",
		value: function moveCards() {
			var cards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			var _collections$from;

			var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "deck";
			var to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "discard";

			if ((_collections$from = this.collections[from]).has.apply(_collections$from, _toConsumableArray(cards))) {
				var _collections$to, _collections$from2;

				(_collections$to = this.collections[to]).add.apply(_collections$to, _toConsumableArray(cards));
				(_collections$from2 = this.collections[from]).remove.apply(_collections$from2, _toConsumableArray(cards));

				return true;
			} else {
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = cards[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var card = _step5.value;

						if (this.collections[from].has(card)) {
							this.collections[to].add(card);
							this.collections[from].remove(card);
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

			return false;
		}
	}, {
		key: "draw",
		value: function draw() {
			var qty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			var cards = this.collections.deck.splice(0, qty);

			if (cards.length > 1) {
				return cards;
			}

			return (cards || [])[0];
		}
	}, {
		key: "drawFromBottom",
		value: function drawFromBottom() {
			var qty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			var cards = this.collections.deck.splice(-qty, qty);

			if (cards.length > 1) {
				return cards;
			}

			return (cards || [])[0];
		}
	}, {
		key: "discard",
		value: function discard() {
			for (var _len3 = arguments.length, cards = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				cards[_key3] = arguments[_key3];
			}

			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = cards[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var card = _step6.value;

					if (this.cards.has(card)) {}
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
		}
	}, {
		key: "shuffle",
		value: function shuffle() {
			var resetDeck = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (resetDeck === true) {
				var _collections$deck;

				var _iteratorNormalCompletion7 = true;
				var _didIteratorError7 = false;
				var _iteratorError7 = undefined;

				try {
					for (var _iterator7 = Object.values(this.collections)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
						var collection = _step7.value;

						collection.empty();
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

				(_collections$deck = this.collections.deck).add.apply(_collections$deck, _toConsumableArray(this.cards));
			}

			var m = this.cards.length,
			    t,
			    i;

			// While there remain elements to shuffle…
			while (m) {

				// Pick a remaining element…
				i = Math.floor(Math.random() * m--);

				// And swap it with the current element.
				t = this.cards[m];
				this.cards[m] = this.cards[i];
				this.cards[i] = t;
			}

			return this.cards;
		}
	}, {
		key: "reshuffle",
		value: function reshuffle() {
			return this.shuffle(true);
		}
	}, {
		key: "createCards",
		value: function createCards() {
			var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "deck";
			var seedFn = arguments[1];
			var qty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

			var cards = _Card2.default.FromSchema(seedFn, qty);

			this.addCards(cards, collection);

			return this;
		}
	}, {
		key: "remaining",
		get: function get() {
			return this.collections.deck.size;
		}
	}, {
		key: "discarded",
		get: function get() {
			return this.collections.discard.size;
		}
	}, {
		key: "size",
		get: function get() {
			return this.cards.size;
		}
	}]);

	return Deck;
}(_AgencyBase3.default);

;

exports.default = Deck;