"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UUID = UUID;

var _uuid = require("uuid");

function UUID(uuid) {
    return function (target) {
        if ((0, _uuid.validate)(uuid)) {
            target.__id = uuid;
        } else {
            target.__id = (0, _uuid.v4)();
        }

        Reflect.defineProperty(target, "id", {
            get: function get() {
                return Reflect.get(target, "__id");
            },
            set: function set(uuid) {
                return Reflect.set(target, "__id", uuid);
            }
        });

        return target;
    };
};

exports.default = UUID;