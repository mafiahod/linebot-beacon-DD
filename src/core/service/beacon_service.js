"use strict";
import { User, Activity } from '../model/index'
import * as config from '../config'
import { Conversation_service, Message_service, GetLocation_service, Elastic_service } from './index'
import { LocalFile } from '../data_access_layer/index'
import { logger } from '../../../logs/logger';



async function handle_beacon_event(userId, displayName, timestamp, hwid, url) {

  var Find_userObj = new User(userId, displayName);  //Find out if the user is a member of the group or not.
  var user = this.dal.find(Find_userObj, null, true);


  if (user.length != 0) {
    var Find_activityObj = new Activity(userId, null, null, null, this.getLocationService.getLocation(hwid)[0], null, null,null,null);  // Find user activity and state
    var user_activity = this.dal.find(Find_activityObj, null, true);

    logger.info(user_activity);

    if (user_activity.length == 0) {  //handle when files(ativity.json & state.json ) are not exist
      var Saveactivity = new Activity(userId, displayName, 'in', timestamp, this.getLocationService.getLocation(hwid)[0], 'none', 'none', url,this.getLocationService.getLocation(hwid)[1]);
     await this.elastic.elasticsave(Saveactivity);
      this.dal.save(Saveactivity);
      return this.Conversationservice.ask_today_plan(userId, this.getLocationService.getLocation(hwid)[0]); //call ask_today_plan ()

    } else {

      for (var i in user_activity) {
        if (user_activity[i].plan != 'none'  && user_activity[i].askstate == true) { // users become active again
          const reenter = {
            type: 'text',
            text: displayName + ' re-enter'
          };
          this.message_service.send_Message(config.ReportGroupId, reenter);
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
    this.message_service = new Message_service();
    this.dal = new LocalFile();
    this.getLocationService = new GetLocation_service();
    this.elastic = new Elastic_service();
  }
}
export {
  Beacon_service
}
