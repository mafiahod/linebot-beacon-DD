'use strict';
import { LocalFile } from '../../data_access_layer/index'
import { Beacon_service, GetLocation_service } from '../../service/index'

var push = new Beacon_service();
const current_datetime = new Date();
const activitytestpath = './src/core/test/service_spec/test_file/' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';
const usertestpath = './src/core/test/service_spec/test_file/user.json'

push.dal = new LocalFile(activitytestpath, usertestpath);
push.getLocationService = new GetLocation_service();
push.getLocationService.locationDir = './src/core/test/service_spec/getlocation_service_test_file/location.json'

describe('handle beacon event', () => {

    it(' should send question to user if user come in  first time when call  ask today plan', () => {
        var pushCalled;
        var state = false;

        var user2 = {
            "userId": "59011178",
            "name": "Jahja",
            "timestamp": 1562774750526,
            "location": "012c75d8a3",

        };

        push.Conversationservice.ask_today_plan = function mock_asktodayplan() {

            state = true ;
            
            }


        push.handle_beacon_event(user2.userId, user2.name, user2.timestamp, user2.location);

        expect(state).toEqual(true);
        // push.Conversationservice.ask_today_plan(user2.userId, user2.location);

        // push.message_service.send_Message = function mock_send_reenter(userId, message) {

        //     pushCalled = {
        //         toId: userId,
        //         message: message
        //     };

        // }

        // expect(pushCalled.message).toEqual("what is your plan todo today ");
    });


    it(' should send message to group if user become active again in the same location when call send messagge sevice', () => {
        var pushCalled1;

        var user2 = {
            "userId": "59010126",
            "name": "Ball",
            "timestamp": 1562774750526,
            "location": "012c75d8a3",
        };

        push.message_service.send_Message= function mock_send(userId, message) {
            pushCalled1 = {
                toId: userId,
                message: message
            };

        }
        push.handle_beacon_event(user2.userId, user2.name, user2.timestamp, user2.location);
       

        expect(pushCalled1.message.text).toEqual(user2.name +" re-enter");

    });





});