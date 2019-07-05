"use strict";
import {User,State,Activity} from '../model/index'
import * as dal from '../data_access_layer/index'
import {ask_today_plan,callback} from './index'
import * as config from '../config'
import {Client} from '@line/bot-sdk'


const client = new Client(config); // create LINE SDK client

   function handle_beacon_event(userId, displayName, timestamp, hwid) {

    var Find_userObj = new User(userId, displayName);
    var user = dal.find(Find_userObj, null, true);

 
    if (user.length != 0) {
      var Find_activityObj = new Activity(userId, null, null, null, dal.getLocation(hwid), null);
      var user_activity = dal.find(Find_activityObj, null, true);
      console.log('user_activity from beacon');
      console.log(user_activity);

      var Find_state = new State(userId, null, null, null, null);//userid,displayname,time,askstate
      var ask_state = dal.find(Find_state, null, true);

      console.log('ask state from beacon');
      console.log(ask_state);

   

      if (user_activity.length == 0 && ask_state.length == 0) {
        
        var Saveactivity = new Activity(userId, displayName, 'in', timestamp, dal.getLocation(hwid), 'none');
        dal.save(Saveactivity);
        console.log("Saveactivity from beacon");
        console.log(Saveactivity);

        var Savestate = new State(userId, displayName, timestamp, dal.getLocation(hwid),'none');
        dal.save(Savestate);
        console.log("Savestate from beacon");
        console.log(Savestate);

        console.log('no activity,state from beacon');
        return ask_today_plan(userId, displayName, timestamp, dal.getLocation(hwid));

      } else {

        for (var i in user_activity) {
          for (var j in ask_state) {

            if (user_activity[i].plan != 'none' && user_activity[i].location == dal.getLocation(hwid) && ask_state[j].askstate == true) {

              console.log('reenter from beacon');

              const message = {
                type: 'text',
                text: displayName + 're-enter'
              };
              client.pushMessage(config.ReportGroupId, message)
                .then(() => {
                }).catch((err) => { });
            }
            
          }
        }
        return;
      }
    }
  }
  export {
    handle_beacon_event
  }

