"use strict";
import { User, State, Activity } from '../model/index'
import * as config from '../config'
import { Conversation_service, Message_service } from './index'
import { LocalFile } from '../data_access_layer/index'



function handle_beacon_event(userId, displayName, timestamp, hwid) {


  var Find_userObj = new User(userId, displayName);  //Find out if the user is a member of the group or not.
  var user = this.dal.find(Find_userObj, null, true);


  if (user.length != 0) {

    var Find_activityObj = new Activity(userId, null, null, null, this.dal.getLocation(hwid), null);  // Find user activity and state
    var user_activity = this.dal.find(Find_activityObj, null, true);

    var Find_state = new State(userId, null, null, null, null);
    var ask_state = this.dal.find(Find_state, null, true);

    if (user_activity.length == 0 && ask_state.length == 0) {  //handle when files(ativity.json & state.json ) are not exist

      var Saveactivity = new Activity(userId, displayName, 'in', timestamp, this.dal.getLocation(hwid), 'none');
      this.dal.save(Saveactivity);


      var Savestate = new State(userId, displayName, timestamp, this.dal.getLocation(hwid), 'none');
      this.dal.save(Savestate);


      return this.Conversationservice.ask_today_plan(userId, displayName, timestamp, this.dal.getLocation(hwid)); //call ask_today_plan ()

    } else {

      for (var i in user_activity) {
        for (var j in ask_state) {

          if (user_activity[i].plan != 'none' && user_activity[i].location == this.dal.getLocation(hwid) && ask_state[j].askstate == true) { // users become active again

            console.log('re-enter from beacon');

            const reenter = {
              type: 'text',
              text: displayName + 're-enter'
            };
            this.Messageservice.push_Message(config.ReportGroupId, reenter);

          }

        }
      }
      return;
    }
  }
}

class Beacon_service {
  constructor() {
    this.Conversationservice = new Conversation_service();
    this.handle_beacon_event = handle_beacon_event;
    this.Messageservice = new Message_service();
    this.dal = new LocalFile();
  }
}
export {
  Beacon_service
}

