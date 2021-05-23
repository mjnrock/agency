"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CardCollection = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Registry2 = require("./../../Registry");

var _Registry3 = _interopRequireDefault(_Registry2);

var _Card = require("./Card");

var _Card2 = _interopRequireDefault(_Card);

var _Deck = require("./Deck");

var _Deck2 = _interopRequireDefault(_Deck);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CardCollection = exports.CardCollection = function (_Registry) {
	_inherits(CardCollection, _Registry);

	function CardCollection() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$cards = _ref.cards,
		    cards = _ref$cards === undefined ? [] : _ref$cards,
		    _ref$maxSize = _ref.maxSize,
		    maxSize = _ref$maxSize === undefined ? Infinity : _ref$maxSize,
		    _ref$minSize = _ref.minSize,
		    minSize = _ref$minSize === undefined ? -Infinity : _ref$minSize,
		    deck = _ref.deck;

		_classCallCheck(this, CardCollection);

		var _this = _possibleConstructorReturn(this, (CardCollection.__proto__ || Object.getPrototypeOf(CardCollection)).call(this));

		_this._deck = deck;
		_this._cards = new Set(cards);

		_this._config = {
			maxSize: maxSize,
			minSize: minSize
		};

		_this.add.apply(_this, _toConsumableArray(cards));
		return _this;
	}

	_createClass(CardCollection, [{
		key: "add",
		value: function add() {
			for (var _len = arguments.length, cards = Array(_len), _key = 0; _key < _len; _key++) {
				cards[_key] = arguments[_key];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = cards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var card = _step.value;

					if (this.size >= this.config.maxSize) {
						return false;
					}

					if (card instanceof CardCollection) {
						this.add.apply(this, _toConsumableArray(card.cards));
					} else if (card instanceof _Card2.default) {
						card._deck = this._deck;

						this._cards.add(card);
						this.register(card);
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

			return true;
		}
	}, {
		key: "remove",
		value: function remove() {
			for (var _len2 = arguments.length, cards = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				cards[_key2] = arguments[_key2];
			}

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = cards[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var card = _step2.value;

					if (this.size <= this.config.minSize) {
						return false;
					}

					if (card instanceof CardCollection) {
						this.remove.apply(this, _toConsumableArray(card.cards));
					} else if (card instanceof _Card2.default) {
						card._deck = null;

						this._cards.delete(card);
						this.unregister(card);
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

			return true;
		}
	}, {
		key: "moveTo",
		value: function moveTo(deckOrCardCollection) {
			if (deckOrCardCollection instanceof _Deck2.default) {
				deckOrCardCollection.addCards(this.cards);

				return true;
			} else if (deckOrCardCollection instanceof CardCollection) {
				deckOrCardCollection.add.apply(deckOrCardCollection, _toConsumableArray(this.cards));
				this.empty();

				return true;
			}

			return false;
		}

		/**
   * Conjunctive test, if more than one (1) <Card> is passed
   */

	}, {
		key: "has",
		value: function has() {
			var results = [];

			for (var _len3 = arguments.length, cards = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				cards[_key3] = arguments[_key3];
			}

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = cards[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var card = _step3.value;

					if (card instanceof CardCollection) {
						var _cards;

						results.push((_cards = this._cards).has.apply(_cards, _toConsumableArray(card.cards)));
					} else if (card instanceof _Card2.default) {
						results.push(this._cards.has(card));
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

			if (cards.length > 1) {
				return results.every(function (v) {
					return v === true;
				});
			}

			return results[0];
		}
	}, {
		key: "empty",
		value: function empty() {
			this._cards = new Set();
		}
	}, {
		key: "deck",
		get: function get() {
			return this.state._deck;
		},
		set: function set(deck) {
			this.state._deck = deck;

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.cards[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var card = _step4.value;

					card.deck = deck;
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
		}
	}, {
		key: "config",
		get: function get() {
			return this.state._config;
		}
	}, {
		key: "cards",
		get: function get() {
			return [].concat(_toConsumableArray(this.state._cards));
		},
		set: function set(cards) {
			this.state._cards = new Set();
			this.add.apply(this, _toConsumableArray(cards.slice(0, this.state._config.maxSize)));
		}
	}, {
		key: "size",
		get: function get() {
			return this.state._cards.size;
		}
	}, {
		key: "isEmpty",
		get: function get() {
			return !this.state._cards.size;
		}
	}]);

	return CardCollection;
}(_Registry3.default);

;

exports.default = CardCollection;