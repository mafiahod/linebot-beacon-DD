"use strict";

Object.defineProperty(exports, "__esModule", {
        value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Userinfo = exports.Userinfo = function Userinfo(lineId, displayName) {
        _classCallCheck(this, Userinfo);

        this.userId = lineId;
        this.name = displayName;
};