import { Activity } from '../model/activity'
import { Userinfo } from '../model/user'

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




      
      if (user_activity.length == 0) {
        console.log('beacon');
        return require_ask.ask_today_plan(userId, displayName,timestamp, local.getLocation(hwid));







      } else {
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
          else if (user_activity[i].location != local.operate.getLocation(hwid)) {
            console.log(' different location');
            return require_ask.ask_today_plan(message, callback);

          }
        }
      }

    }

  }





}

