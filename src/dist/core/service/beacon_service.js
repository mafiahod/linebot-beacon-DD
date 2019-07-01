'use strict';

var _activity = require('../model/activity');

var _user = require('../model/user');

var require_ask = require('./conversation_service');
var line = require('@line/bot-sdk');
var config = require('../config');
var local = require('../data_access_layer/local_file');

var client = new line.Client(config); // create LINE SDK client

module.exports = {

  handle_beacon_event: function handle_beacon_event(userId, displayName, timestamp, hwid) {

    var Find_userObj = new _user.Userinfo(userId, displayName);
    console.log('show userInfo');
    console.log(Find_userObj);
    var result = local.findInform(Find_userObj, null, true);
    console.log(result);
    console.log('Before Loop');
    console.log(result.length);

    if (result.length != 0) {
      var Find_activityObj = new _activity.Activity(userId, null, null, null, local.getLocation(hwid), null);
      console.log(Find_activityObj);
      var user_activity = local.findInform(Find_activityObj, null, true);

      console.log('hello');
      console.log(user_activity);

      if (user_activity.length == 0) {
        console.log('beacon');
        return require_ask.ask_today_plan(userId, displayName, timestamp, local.getLocation(hwid));
      } else {
        console.log('reenter11');
        for (i = 0; i < user_activity.length; i++) {
          if (user_activity[i].location == local.getLocation && user_activity[i].plan != null) {
            var _message = {
              type: 'text',
              text: displayName + 're-enter'
            };
            client.pushMessage(config.ReportGroupId, _message).then(function () {}).catch(function (err) {});
          } else if (user_activity[i].location != local.operate.getLocation(hwid)) {
            console.log(' different location');
            return require_ask.ask_today_plan(message, callback);
          }
        }
      }
    }
  }

};