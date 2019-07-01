const activity = require('../model/activity');
const require_ask = require('./conversation_service');
const line = require('@line/bot-sdk');
const config = require('../config');
const user = require('../model/user');
const states = require('../model/state');
const local = require('../data_access_layer/local_file');

const client = new line.Client(config); // create LINE SDK client

module.exports = {


  handle_beacon_event: function (event) {

    var Find_userObj = new user.userInfo(event.source.userId, null);
    var result = local.operate.findInform(Find_userObj, null, true);



    if (result.length != 0) {

      var Find_activityObj = new activity.activityInfo(event.source.userId, null, null, null, null, null);
      var user_activity = local.operate.findInform(Find_activityObj, null, true);

      console.log('hello');

    
      console.log(user_activity);

        client.getProfile(event.source.userId)
          .then((profile) => {

            if (user_activity.length == 0) {
              console.log('beacon');
              return require_ask.ask_today_plan(event.source.userId,event.timestamp,event.beacon.hwid);

            } else {
             
              console.log('reenter11');

              for (i = 0; i < user_activity.length; i++) {


                if (user_activity[i].location == local.getLocation && user_activity[i].plan != null) {
               
                  const message = {
                    type: 'text',
                    text: profile.displayName + 're-enter'
                  };

                  client.pushMessage(config.ReportGroupId, message)
                    .then(() => {

                    }).catch((err) => { });
                }

                else if (user_activity[i].location != local.operate.getLocation(event.beacon.hwid)) {

                  console.log(' different location');

                  return require_ask.ask_today_plan(message, callback);

                }
              }
            }
          }).catch((err) => { });

      }

    }
  


 

  }

