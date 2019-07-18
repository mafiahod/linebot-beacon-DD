'use strict';
import { LocalFile } from '../../data_access_layer/index'
import { Beacon_service, GetLocation_service } from '../../service/index'

var push = new Beacon_service();
const activitytestpath = './src/core/test/service_spec/test_file/activity.json'
const usertestpath = './src/core/test/service_spec/test_file/user.json'

push.dal = new LocalFile(activitytestpath, usertestpath);
push.getLocationService = new GetLocation_service();
push.getLocationService.locationDir = './src/core/test/service_spec/getlocation_service_test_file/location.json'

describe('handle beacon event', () => {

    it(' should send message to group if user become active again in the same location', () => {
        var pushCalled1;

        var user2 = {
            "userId": "59010126",
            "name": "Ball",
            "type": "in",
            "timestamp": 1562774750526,
            "location": "012c75d8a3",
            "askstate": true,
            "plan": "Work"
        };


        push.handle_beacon_event(user2.userId, user2.name, user2.timestamp, user2.location);
        
        push.Messageservice.send_Message = function mock_send_reenter(groupId, message) {

            pushCalled1 = {
                toId: groupId,
                message: message
            };

        }
     
        push.Messageservice.send_Message("1111", "reenter");
      
        expect(pushCalled1.message).toEqual("reenter");

    });


});