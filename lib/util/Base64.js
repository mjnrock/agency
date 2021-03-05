"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Base64 = undefined;

var _isBase = require("is-base64");

var _isBase2 = _interopRequireDefault(_isBase);

var _nodeFetch = require("node-fetch");

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var envFetch = fetch || _nodeFetch2.default;

var Base64 = exports.Base64 = {
    // If successful, will return a base64 string with mime, else false
    Encode: function Encode(input) {
        var quality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;

        return new Promise(function (resolve, reject) {
            try {
                if (input instanceof HTMLCanvasElement) {
                    return resolve(input.toDataURL("image/png", quality));
                } else if (input instanceof HTMLImageElement) {
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");

                    canvas.width = input.width;
                    canvas.height = input.height;

                    ctx.drawImage(input, 0, 0);

                    return resolve(Base64.Encode(canvas, quality));
                } else if ((0, _isBase2.default)(input, { mimeRequired: true })) {
                    return resolve(input);
                } else {
                    return resolve(false);
                }
            } catch (e) {
                return reject(e);
            }
        });
    },

    // If successful, will return a resolve(<canvas>), else will reject(@input)
    Decode: function Decode(input) {
        return new Promise(function (resolve, reject) {
            try {
                if (input instanceof HTMLCanvasElement || input instanceof HTMLImageElement) {
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");

                    canvas.width = input.width;
                    canvas.height = input.height;

                    ctx.drawImage(input, 0, 0);

                    return resolve(canvas);
                } else if ((0, _isBase2.default)(input, { mimeRequired: true })) {
                    var _canvas = document.createElement("canvas");
                    var _ctx = _canvas.getContext("2d");

                    var img = new Image();
                    img.onload = function () {
                        _canvas.width = img.width;
                        _canvas.height = img.height;

                        _ctx.drawImage(img, 0, 0);

                        return resolve(_canvas);
                    };
                    img.src = input;
                } else {
                    return reject(input);
                }
            } catch (e) {
                return reject(e);
            }
        });
    },

    FileDecode: function FileDecode(path) {
        var allowAnonymous = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        return new Promise(function (resolve, reject) {
            try {
                if (path.match(/\.(json|txt)/i)) {
                    var opts = function opts(header) {
                        return {
                            method: "GET",
                            mode: allowAnonymous ? "cors" : "no-cors",
                            headers: {
                                "Content-Type": header
                            }
                        };
                    };

                    if (path.match(/\.(json)/i)) {
                        envFetch(path, opts("application/json")).then(function (response) {
                            return response.json();
                        }).then(function (data) {
                            resolve(Base64.Decode(data));
                        }).catch(function (e) {
                            return reject(e);
                        });
                    } else if (path.match(/\.(txt)/i)) {
                        envFetch(path, opts("text/plain;charset=UTF-8")).then(function (response) {
                            return response.text();
                        }).then(function (data) {
                            resolve(Base64.Decode(data));
                        }).catch(function (e) {
                            return reject(e);
                        });
                    }
                } else {
                    var img = new Image();
                    if (allowAnonymous === true) {
                        img.crossOrigin = "anonymous";
                    }
                    img.src = path;

                    img.onload = function () {
                        if (img.width) {
                            resolve(Base64.Decode(img));
                        }

                        reject(false);
                    };
                    img.onerror = function () {
                        return reject(false);
                    };
                }
            } catch (e) {
                return reject(e);
            }
        });
    }
};

exports.default = Base64;