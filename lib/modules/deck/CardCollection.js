"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CardCollection = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Registry2 = require("./../../Registry");

var _Registry3 = _interopRequireDefault(_Registry2);

var _Card = require("./Card");

var _Card2 = _interopRequireDefault(_Card);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Importantly, the <CardCollection> maintains **no provenance**
 * 	of any of its <Card> contents.  If a stateful-awareness of the
 * 	cards is needed, create a <Deck> from the collection.
 */
var CardCollection = exports.CardCollection = function (_Registry) {
	_inherits(CardCollection, _Registry);

	function CardCollection() {
		var cards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		_classCallCheck(this, CardCollection);

		var _this = _possibleConstructorReturn(this, (CardCollection.__proto__ || Object.getPrototypeOf(CardCollection)).call(this));

		if (!Array.isArray(cards)) {
			cards = [cards];
		}
		_this.addCards(cards);
		return _this;
	}

	_createClass(CardCollection, [{
		key: "getCards",
		value: function getCards() {
			var cards = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var card = _step.value;

					cards.push(card);
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

			return cards;
		}
	}, {
		key: "setCards",
		value: function setCards() {
			for (var _len = arguments.length, cards = Array(_len), _key = 0; _key < _len; _key++) {
				cards[_key] = arguments[_key];
			}

			if (Array.isArray(cards[0])) {
				cards = cards[0];
			}

			this.empty();
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = cards[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var card = _step2.value;

					this.addCard(card);
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

			return this;
		}
	}, {
		key: "addCard",
		value: function addCard(card) {
			if (card instanceof _Card2.default) {
				for (var _len2 = arguments.length, synonyms = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
					synonyms[_key2 - 1] = arguments[_key2];
				}

				this.register.apply(this, [card].concat(synonyms));
			} else if (card instanceof CardCollection) {
				card.copyTo(this, true);
			}

			return this;
		}
	}, {
		key: "addCards",
		value: function addCards() {
			var addCardArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = addCardArgs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var args = _step3.value;

					if (!Array.isArray(args)) {
						args = [args];
					}

					this.addCard.apply(this, _toConsumableArray(args));
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

			return this;
		}
	}, {
		key: "removeCard",
		value: function removeCard(cardOrSynonym) {
			if (cardOrSynonym instanceof _Card2.default) {
				this.unregister(cardOrSynonym);
			} else if (cardOrSynonym instanceof CardCollection) {
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = cardOrSynonym[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var card = _step4.value;

						this.removeCard(card);
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

			return this;
		}
	}, {
		key: "removeCards",
		value: function removeCards() {
			var removeCardArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = removeCardArgs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var args = _step5.value;

					if (!Array.isArray(args)) {
						args = [args];
					}

					this.removeCard.apply(this, _toConsumableArray(args));
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

			return this;
		}

		/**
   * Deletes all cards from the collection
   */

	}, {
		key: "empty",
		value: function empty() {
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = this[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var card = _step6.value;

					this.removeCard(card);
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

			return this;
		}
		/**
   * Deletes all cards from the collection that
   * 	qualify {{ @filterFn => true }}
   * 
   * Opposite of << .consume >>
   */

	}, {
		key: "purge",
		value: function purge(filterFn) {
			if (typeof filterFn === "function") {
				var _iteratorNormalCompletion7 = true;
				var _didIteratorError7 = false;
				var _iteratorError7 = undefined;

				try {
					for (var _iterator7 = this[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
						var card = _step7.value;

						if (filterFn(card, this) === true) {
							this.unregister(card);
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
			}

			return this;
		}
		/**
   * Adds all cards from the collection that
   * 	qualify {{ @includeFn => true }}
   * 
   * Opposite of << .purge >>
   */

	}, {
		key: "consume",
		value: function consume(collection, includeFn, synonymFn) {
			if (collection instanceof CardColection && typeof includeFn === "function") {
				var _iteratorNormalCompletion8 = true;
				var _didIteratorError8 = false;
				var _iteratorError8 = undefined;

				try {
					for (var _iterator8 = collection[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
						var card = _step8.value;

						if (includeFn(card, collection) === true) {
							var _synonyms = [];
							if (typeof synonymFn === "function") {
								_synonyms = synonymFn(card, collection, this);

								if (!Array.isArray(_synonyms)) {
									_synonyms = [_synonyms];
								}
							}

							this.register.apply(this, [card].concat(_toConsumableArray(_synonyms)));
						}
					}
				} catch (err) {
					_didIteratorError8 = true;
					_iteratorError8 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion8 && _iterator8.return) {
							_iterator8.return();
						}
					} finally {
						if (_didIteratorError8) {
							throw _iteratorError8;
						}
					}
				}
			}

			return this;
		}

		/**
   * This creates a duplicate of the <CardCollection>
   * 	and returns it.  By default, the cards will *not*
   * 	receive new ids.
   */

	}, {
		key: "duplicate",
		value: function duplicate() {
			var reassignIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			var cc = new CardCollection();

			return cc.copyFrom(this, reassignIds);
		}
	}, {
		key: "copyFrom",
		value: function copyFrom(collectionOrMap) {
			var reassignIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (collectionOrMap instanceof CardCollection) {
				collectionOrMap = collectionOrMap.map;
			}

			var ccObj = [].concat(_toConsumableArray(collectionOrMap)).map(function (_ref) {
				var _ref2 = _slicedToArray(_ref, 2),
				    k = _ref2[0],
				    v = _ref2[1];

				var newCard = k.$copy(reassignIds);

				return [newCard, v];
			});

			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = ccObj[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var _step9$value = _toArray(_step9.value),
					    card = _step9$value[0],
					    _synonyms2 = _step9$value.slice(1);

					this.addCard.apply(this, [card].concat(_toConsumableArray(_synonyms2)));
				}
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9.return) {
						_iterator9.return();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}

			return this;
		}
	}, {
		key: "copyTo",
		value: function copyTo(collection) {
			var copySynonyms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			if (collection instanceof CardCollection) {
				if (copySynonyms) {
					collection.copyFrom(this);
				} else {
					collection.addCards(this.getCards());
				}
			}

			return this;
		}

		//FIXME	Think about this more 
		// index(i) {
		// 	return [ ...this.cards ].splice(i, 1)[ 0 ];
		// }
		// take(qty = 1) {
		// 	const cards = [];
		// 	for(let i = 0; i < qty; i++) {
		// 		const index = this.order.shift();
		// 		const card = this.index(index);

		// 		cards.push(card);
		// 		this.removeCard(card);
		// 	}

		// 	if(cards.length > 1) {
		// 		return new CardCollection(cards);
		// 	}

		// 	return cards[ 0 ];
		// }

	}, {
		key: "transfer",
		value: function transfer() {
			var cards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var to = arguments[1];
			var transferSynonyms = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			if (!Array.isArray(cards)) {
				cards = [cards];
			}

			var map = this.map;
			if (to instanceof CardCollection) {
				var _iteratorNormalCompletion10 = true;
				var _didIteratorError10 = false;
				var _iteratorError10 = undefined;

				try {
					for (var _iterator10 = cards[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
						var card = _step10.value;

						if (this.has(card)) {
							if (transferSynonyms) {
								to.addCard.apply(to, [card].concat(_toConsumableArray(map.get(card))));
							} else {
								to.addCard(card);
							}

							this.removeCard(card);
						}
					}
				} catch (err) {
					_didIteratorError10 = true;
					_iteratorError10 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion10 && _iterator10.return) {
							_iterator10.return();
						}
					} finally {
						if (_didIteratorError10) {
							throw _iteratorError10;
						}
					}
				}
			}
		}
	}, {
		key: "transferFrom",
		value: function transferFrom(collection) {
			var transferSynonyms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			if (collection instanceof CardCollection) {
				collection.transferTo(this, transferSynonyms);
			}

			return this;
		}
	}, {
		key: "transferTo",
		value: function transferTo(collection) {
			var transferSynonyms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			if (collection instanceof CardCollection) {
				this.copyTo(collection, transferSynonyms);

				this.empty();
			}

			return this;
		}
	}, {
		key: "fromDeck",
		value: function fromDeck(deck) {
			var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			    _ref3$copy = _ref3.copy,
			    copy = _ref3$copy === undefined ? true : _ref3$copy,
			    _ref3$transfer = _ref3.transfer,
			    transfer = _ref3$transfer === undefined ? false : _ref3$transfer,
			    _ref3$reassignIds = _ref3.reassignIds,
			    reassignIds = _ref3$reassignIds === undefined ? false : _ref3$reassignIds,
			    _ref3$synonyms = _ref3.synonyms,
			    synonyms = _ref3$synonyms === undefined ? true : _ref3$synonyms;

			if (copy) {
				this.copyFrom(deck.cards, reassignIds);
			} else if (transfer) {
				this.transferFrom(deck.cards, synonyms);
			}

			return this;
		}
	}], [{
		key: "FromDeck",
		value: function FromDeck(deck) {
			var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			    _ref4$copy = _ref4.copy,
			    copy = _ref4$copy === undefined ? true : _ref4$copy,
			    _ref4$transfer = _ref4.transfer,
			    transfer = _ref4$transfer === undefined ? false : _ref4$transfer,
			    _ref4$reassignIds = _ref4.reassignIds,
			    reassignIds = _ref4$reassignIds === undefined ? false : _ref4$reassignIds,
			    _ref4$synonyms = _ref4.synonyms,
			    synonyms = _ref4$synonyms === undefined ? true : _ref4$synonyms;

			var collection = new CardCollection();

			if (copy) {
				collection.copyFrom(deck.cards, reassignIds);
			} else if (transfer) {
				collection.transferFrom(deck.cards, synonyms);
			}

			return collection;
		}
	}]);

	return CardCollection;
}(_Registry3.default);

;

exports.default = CardCollection;