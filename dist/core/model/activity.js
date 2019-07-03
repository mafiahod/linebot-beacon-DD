"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Activity = exports.Activity = function Activity(id, user, coming, timestamp, location, activityInfo) {
    _classCallCheck(this, Activity);

    this.userId = id;
    this.name = user;
    this.type = coming;
    this.timestamp = timestamp;
    this.location = location;
    this.plan = activityInfo;
};