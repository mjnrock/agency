"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.useObserver = useObserver;
exports.useBeacon = useBeacon;

var _react = require("react");

var _Observer = require("./Observer");

var _Observer2 = _interopRequireDefault(_Observer);

var _Observable = require("./Observable");

var _Observable2 = _interopRequireDefault(_Observable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function useObserver(context, prop) {
    var ctx = (0, _react.useContext)(context);

    var _useState = (0, _react.useState)(prop ? ctx[prop] : ctx),
        _useState2 = _slicedToArray(_useState, 2),
        observable = _useState2[0],
        setObservable = _useState2[1];

    var _useState3 = (0, _react.useState)({}),
        _useState4 = _slicedToArray(_useState3, 2),
        data = _useState4[0],
        setData = _useState4[1];

    (0, _react.useEffect)(function () {
        var fn = function fn(prop, value) {
            if (observable) {
                setData(_extends({}, observable.toData(), _defineProperty({}, prop, value)));
            }
        };

        var obs = void 0;
        if (observable instanceof _Observable2.default) {
            obs = new _Observer2.default(observable);
        } else {
            obs = _Observer2.default.Generate(observable);
        }
        obs.on("next", fn);

        return function () {
            obs.off("next", fn);
            obs = null;
        };
    }, []);
    (0, _react.useEffect)(function () {
        setData(observable.toData());
    }, [observable]);

    return [data, observable];
};

function useBeacon(context, prop) {
    var ctx = (0, _react.useContext)(context);

    var _useState5 = (0, _react.useState)(prop ? ctx[prop] : ctx),
        _useState6 = _slicedToArray(_useState5, 2),
        beacon = _useState6[0],
        setBeacon = _useState6[1];

    var _useState7 = (0, _react.useState)({}),
        _useState8 = _slicedToArray(_useState7, 2),
        data = _useState8[0],
        setData = _useState8[1];

    (0, _react.useEffect)(function () {
        var fn = function fn(prop, value) {
            if (beacon) {
                setData(_extends({}, data, _defineProperty({}, prop, value)));
            }
        };
        beacon.on("next", fn);

        return function () {
            beacon.off("next", fn);
            setBeacon(null);
        };
    }, []);

    (0, _react.useEffect)(function () {
        setData({});
    }, [beacon]);

    return { data: data, beacon: beacon };
};

exports.default = {
    useObserver: useObserver,
    useBeacon: useBeacon
};

//! React Example Usage
//==========================================================
// export const ctx = new Agency.Observable.Factory({
//     cats: 2,
// });
// // export const ctx = new Agency.Context.Factory({
// //     cats: 2,
// // });
// // export const ctx = new Agency.Store.Factory({
// //     cats: 2,
// // }, (state, prop, value) => {
// //     return {
// //         ...state,
// //         [ prop ]: Number.isNaN(state[ prop ]) ? 0 : state[ prop ] + 1,
// //     }
// // });
// export const Context = React.createContext(ctx);

// function App() {
//     return (
//         <Router>
//             <ScrollToTop>
//                 <Context.Provider value={{
//                     game: ctx,
//                 }}>
//                     <Switch>                            
//                         <Route path="/">
//                             <Routes.Home />
//                         </Route>
//                     </Switch>
//                 </Context.Provider>
//             </ScrollToTop>
//         </Router>
//     )
// }

// export default App;

// /* eslint-disable */
// import React from "react";
// import { Segment } from "semantic-ui-react";

// import { Context } from "./../../App";
// import { useObserver } from "@lespantsfancy/agency/lib/react";

// export default function GameView() {
//     const [ data, game ] = useObserver(Context, "game");

//     if(Object.keys(game || {}).length === 0) {
//         return null;
//     }

//     return (
//         <Segment textAlign="center">
//             <div>Cats: { data.cats }</div>
//             <div>Dogs: { data.dogs }</div>

//             <button
//                 onClick={ e => {
//                     game.cats += 1;
//                     // game.dispatch("cats", 1);
//                 } }
//             >Click</button>
//         </Segment>
//     )
// }