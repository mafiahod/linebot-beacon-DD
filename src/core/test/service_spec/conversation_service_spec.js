'use strict';
import { Conversation_service } from '../../service/index'
import { LocalFile } from '../../data_access_layer/index'

import { Beacon_service, GetLocation_service } from '../../service/index'
var push = new Conversation_service();
const current_datetime = new Date();
const activitytestpath = './src/core/test/service_spec/test_file/' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';
const usertestpath = './src/core/test/service_spec/test_file/user.json'

push.dal = new LocalFile(activitytestpath, usertestpath);
describe('conversation service ', () => {

    it('should return state equal "true" when user reply message and call sendwalkin message first condition', () => {
        var state = false;
        var user2 = {
            "userId": "59010126",
            "name": "Ball",
            "message": {
                "type": "text",
                "id":"21328934",
                "text":"work"
            }
          
        }
        push.message_service.sendwalkin_Message = function mock_sendwalkin() {

            state = true ;
            
            }

        push.handle_in_Message(user2.message,user2.userId);
    
        expect(state).toEqual(true);
        

        });

        it('should send you answered the question to user if user answered the question in second condition', () => {
            var value;
            var user3 = {
                "userId": "59010127",
                "name": "ping",
            }
            push.message_service.send_Message = function mock_send_reenter(userId, message) {

                        value = {
                            toId: userId,
                            message: message
                        };
            
                    }
            push.handle_in_Message("hi",user3.userId);
        
            expect(value.message.text).toEqual("you answered the question");
            
    
            });

    it('should send queastion to user when call ask_today_plan', () => {

        var pushCalled;

        var user2 = {
            "userId": "59011166",
            "name": "Grace",
            "timestamp": 1562774750526,
            "location": "Dimension Data Office, Asok",

        };


        push.ask_today_plan(user2.userId, user2.location);

        push.message_service.send_Message = function mock_send_reenter(userId, message) {

            pushCalled = {
                toId: userId,
                message: message
            };

        }
        push.message_service.send_Message('user2.userId', "what is your plan todo today ");


        expect(pushCalled.message).toEqual("what is your plan todo today ");
    });

    it('should push 3 message even late reply when call callback()', (done) => {

        var resultArray = [];
        var user2 = {
            "userId": "59011111",
            "name": "jam",
            "timestamp": 1562774750526,
            "location": "Dimension Data Office, Asok",

        };

        push.callback(user2.userId, user2.location, 0)

        push.message_service.send_Message = function mock_callback(userId, message) {
            resultArray.push({
                toId: userId,
                message: message
            });

        }

        setTimeout(() => {
            console.log(resultArray);
            expect(resultArray.length).toEqual(3);
            done();
        }, 4000);
    });



    it('should push message 6 times if users are arrive 2 people', (done) => {
        var dataArray = [];
            var user2 = {
                "userId": "59011112",
                "name": "jib",
                "timestamp": 1562774750526,
                "location": "Dimension Data Office, Asok",
    
            };
            var user1 = {
                "userId": "59011113",
                "name": "jang",
                "timestamp": 1562774750526,
                "location": "Dimension Data Office, Asok",
    
            };
    
            push.message_service.send_Message = function mock_callback(userId, message) {
                dataArray.push({
                    toId: userId,
                    message: message
                });
    
            }
        push.callback(user2.userId, user2.location, 0);
        push.callback(user1.userId, user1.location, 0);

        setTimeout(() => {
            console.log(dataArray);
            expect(dataArray.length).toEqual(6);
            done();
        }, 4000);
    });

});