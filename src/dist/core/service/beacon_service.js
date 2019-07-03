"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handle_beacon_event = undefined;

var _index = require('../model/index');

var _index2 = require('../data_access_layer/index');

var _index3 = require('./index');

var line = require('@line/bot-sdk');
var config = require('../config');

var client = new line.Client(config); // create LINE SDK client

function handle_beacon_event(userId, displayName, timestamp, hwid) {

  var Find_userObj = new _index.Userinfo(userId, displayName);
  console.log('show userInfo from beacon');
  console.log(Find_userObj);
  var result = (0, _index2.findInform)(Find_userObj, null, true);
  console.log(result);
  console.log('Before Loop from beacon');
  console.log(result.length);

  if (result.length != 0) {
    var Find_activityObj = new _index.Activity(userId, null, null, null, (0, _index2.getLocation)(hwid), null);
    var user_activity = (0, _index2.findInform)(Find_activityObj, null, true);

    console.log('user_activity from beacon');
    console.log(user_activity);

    var Find_state = new _index.State(userId, null, null, null, null); //userid,displayname,time,askstate
    var ask_state = (0, _index2.findInform)(Find_state, null, true);

    console.log('ask state from beacon');
    console.log(ask_state);

    console.log(user_activity.length);
    console.log(ask_state.length);

    if (user_activity.length == 0 && ask_state.length == 0) {

      var Saveactivity = new _index.Activity(userId, displayName, 'in', timestamp, (0, _index2.getLocation)(hwid), 'none');
      console.log("before Saveactivity from beacon");
      (0, _index2.saveInform)(Saveactivity);
      console.log("Saveactivity from beacon");
      console.log(Saveactivity);

      var Savestate = new _index.State(userId, displayName, timestamp, (0, _index2.getLocation)(hwid), 'none');
      console.log("before Savestate from beacon");
      (0, _index2.saveInform)(Savestate);
      console.log("Savestate from beacon");
      console.log(Savestate);

      console.log('first time from beacon');
      return (0, _index3.ask_today_plan)(userId, displayName, timestamp, (0, _index2.getLocation)(hwid));
    } else {

      for (var i in user_activity) {
        for (var j in ask_state) {

          if (user_activity[i].plan != 'none' && user_activity[i].location == (0, _index2.getLocation)(hwid) && ask_state[j].askstate == true) {

            console.log('reenter11 from beacon');

            var _message = {
              type: 'text',
              text: displayName + 're-enter'
            };
            client.pushMessage(config.ReportGroupId, _message).then(function () {}).catch(function (err) {});
          } else if (user_activity[i].plan != 'none' && user_activity[i].location != (0, _index2.getLocation)(hwid) && ask_state[j].askstate != 'none') {
            console.log(' different location from beacon');
            return (0, _index3.ask_today_plan)(message, _index3.callback);
          }
        }
      }
      return;
    }
  }
}
exports.handle_beacon_event = handle_beacon_event;