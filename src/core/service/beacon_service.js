import { Activity } from '../model/activity'
import { Userinfo } from '../model/user'
import { State } from '../model/state'

const require_ask = require('./conversation_service');
const line = require('@line/bot-sdk');
const config = require('../config');
const local = require('../data_access_layer/local_file');

const client = new line.Client(config); // create LINE SDK client

module.exports = {


  handle_beacon_event: function (userId, displayName, timestamp, hwid) {

    var Find_userObj = new Userinfo(userId, displayName);
    console.log('show userInfo');
    console.log(Find_userObj);
    var result = local.findInform(Find_userObj, null, true);
    console.log(result);
    console.log('Before Loop');
    console.log(result.length);

    if (result.length != 0) {
      var Find_activityObj = new Activity(userId, null, null, null, local.getLocation(hwid), null);
      console.log(Find_activityObj);
      var user_activity = local.findInform(Find_activityObj, null, true);

      console.log('hello');
      console.log(user_activity);


      var Find_state = new State(userId, null, null, null,null);//userid,displayname,time,askstate
      console.log(Find_state);
      var ask_state = local.findInform(Find_state, null, true);

      for (var i in user_activity) {
        for (var j in ask_state) {

          if (user_activity[i].plan == 'none' && ask_state[j].askstate == 'none') {
            console.log('first time');
            return require_ask.ask_today_plan(userId, displayName, timestamp, local.getLocation(hwid));

          } else if (user_activity[i].plan == 'none' && ask_state[j].askstate != 'none') {
            console.log('waiting for ans');
            return require_ask.callback();

          } else if (user_activity[i].plan != 'none' && user_activity[i].location == local.getLocation(hwid) && ask_state[j].askstate != 'none') {

            console.log('reenter11');
            for (i = 0; i < user_activity.length; i++) {
              if (user_activity[i].location == local.getLocation && user_activity[i].plan != null) {
                const message = {
                  type: 'text',
                  text: displayName + 're-enter'
                };
                client.pushMessage(config.ReportGroupId, message)
                  .then(() => {
                  }).catch((err) => { });
              }
              else if (user_activity[i].plan != 'none' && user_activity[i].location != local.getLocation(hwid) && ask_state[j].askstate != 'none') {
                console.log(' different location');
                return require_ask.ask_today_plan(message, callback);

              }
            }
          }

        }
      }
    }
  }
}

