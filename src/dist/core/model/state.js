"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = exports.State = function State(userid, displayname, time, location, askstate) {
    _classCallCheck(this, State);

    this.userId = userid;
    this.name = displayname;
    this.time = time;
    this.location = location;
    this.askstate = askstate;
};