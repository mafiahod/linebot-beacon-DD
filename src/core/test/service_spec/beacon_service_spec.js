'use strict';
import { Beacon_service } from '../../service/index'
var push = new Beacon_service();

describe('handle beacon event', () => {

    it(' should send message to group if user become active again in the same location', () => {
        var pushCalled;
        var pushCalled1;
        var useractivity = [];
        var user1 = {
            "userId": "1",
            "name": "..BALL..",
            "type": "in",
            "timestamp": 1562774750526,
            "location": "11111",
            "askstate": "none",
            "plan": "work"
        };
        var user2 = {
            "userId": "1",
            "name": "..BALL..",
            "type": "in",
            "timestamp": 1562774750526,
            "location": "22222",
            "askstate": "none",
            "plan": "work"
        };
        useractivity.push(user1);
        useractivity.push(user2);

        push.handle_beacon_event = function mock_beacon(userId, location) {

            for (var i in useractivity) {


                if (userId == useractivity[i].userId && location == useractivity[i].location && useractivity[i].askstate == 'none') {

                    push.Conversationservice.ask_today_plan = function mock_asktodayplan() {

                        useractivity[i].askstate = true;

                        push.Messageservice.send_Message = function mock_send_reenter(userId, message) {
                           
                            pushCalled = {
                                toId: userId,
                                message: message
                            };

                        }
                        push.Messageservice.send_Message(userId, "what is your plan")
                    }
                   
                    push.Conversationservice.ask_today_plan();

                } else if (userId == useractivity[i].userId && location == useractivity[i].location && useractivity[i].askstate != 'none') {

                    push.Messageservice.send_Message = function mock_send_reenter(groupId, message) {

                        pushCalled1 = {
                            toId: groupId,
                            message: message
                        };

                    }

                    push.Messageservice.send_Message(userId, "reenter");



                }
            }
        }
        push.handle_beacon_event("1", "22222");
        expect(pushCalled.message).toEqual("what is your plan");
        push.handle_beacon_event("1", "22222");
        expect(pushCalled1.message).toEqual("reenter");
        push.handle_beacon_event("1", "11111");
        expect(pushCalled.message).toEqual("what is your plan");

    });


});