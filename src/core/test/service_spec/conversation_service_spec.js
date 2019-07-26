(function () {'use strict';}());

import {  ConversationService, ElasticService } from '../../service';
import { LocalFile } from '../../data_access_layer';
import { Activity } from '../../model';
import { mockMessageService } from '../../../utility/test_tool/mock';
import { clearDir } from '../../../utility/test_tool/test_resource';
import { logger } from '../../../logger';
import  config from '../../config';

const testpath = './test_file/';
const dal = new LocalFile(testpath , [Activity]);
const pushCalled = [];
var conversationService = new ConversationService(dal,mockMessageService(pushCalled), new ElasticService());

const resetDB = ()=>{clearDir(testpath);};
describe ('conversation_service:',()=>{
    describe('handleInMessage()', () => {
        const forTest = {
            "userId": "59010126",
            "name": "Ball",
            "message": {
                "type": "text",
                "id":"21328934",
                "text":"work"
            }
        };
        beforeEach(()=>{
            pushCalled.length = 0; //clear message queue
            resetDB();
        });

        it('when receive message from 1 exist matched user in DB should send flex message to group',done=>{
            dal.save(new Activity(forTest.userId,forTest.name,'in',new Date().getTime,'BBL',true,'none','url'));
            conversationService.handleInMessage(forTest.message,forTest.userId).then(()=>{
                expect(pushCalled).toEqual([{toId:config.ReportGroupId,message:conversationService.messageService.createWalkInMessage(new Activity(forTest.userId,forTest.name,'in',new Date().getTime(),'BBL',true,forTest.message.text,'url'))}]);
                done();
            }).catch(err=>{logger.error(err);});
        });

        it('when recieve message with no activity in DB should not response anything', () => {
            conversationService.handleInMessage(forTest.message,forTest.userId)
            .then(()=>{
                expect(pushCalled).toEqual([]);
            }).catch(()=>{});
        });

        it('when receive user message but [plan] of latest activity of user exist should send message that user had answered the question',()=>{
            dal.save(new Activity(forTest.userId,forTest.name,'in',new Date().getTime,'BBL',true,'Do some work','url'));
            conversationService.handleInMessage(forTest.message,forTest.userId);
            expect(pushCalled).toEqual([{toId:forTest.userId,message:{type:'text',text:"you already have answered the question"}}]);
        });
    });
    describe("askTodayPlan()",()=>{
        beforeEach(()=>{
            pushCalled.length = 0; //clear message queue
            resetDB();
        });

        it('when receive no message comming within Alert duration should warning message for 3 round',()=>{

        });

        //     it('should send you answered the question to user if user answered the question in second condition', () => {
        //         var value;
        //         var user3 = {
        //             "userId": "59010127",
        //             "name": "ping",
        //         };
        //         conversationService.message_service.sendMessage = function mock_send_reenter(userId, message) {

        //                     value = {
        //                         toId: userId,
        //                         message: message
        //                     };
                
        //                 };
        //         conversationService.handleInMessage("hi",user3.userId);
            
        //         expect(value.message.text).toEqual("you answered the question");
                
        
        //         });

        // it('should send queastion to user when call ask_today_plan', () => {

        //     var pushCalled;

        //     var user2 = {
        //         "userId": "59011166",
        //         "name": "Grace",
        //         "timestamp": 1562774750526,
        //         "location": "Dimension Data Office, Asok",

        //     };


        //     conversationService.ask_today_plan(user2.userId, user2.location);

        //     conversationService.message_service.sendMessage = function mock_send_reenter(userId, message) {

        //         pushCalled = {
        //             toId: userId,
        //             message: message
        //         };

        //     };
        //     conversationService.message_service.sendMessage('user2.userId', "what is your plan todo today ");


        //     expect(pushCalled.message).toEqual("what is your plan todo today ");
        // });

        // it('should push 3 message even late reply when call callback()', (done) => {

        //     var resultArray = [];
        //     var user2 = {
        //         "userId": "59011111",
        //         "name": "jam",
        //         "timestamp": 1562774750526,
        //         "location": "Dimension Data Office, Asok",

        //     };

        //     conversationService.callback(user2.userId, user2.location, 0)

        //     conversationService.message_service.sendMessage = function mock_callback(userId, message) {
        //         resultArray.push({
        //             toId: userId,
        //             message: message
        //         });

        //     };

        //     setTimeout(() => {
        //         console.log(resultArray);
        //         expect(resultArray.length).toEqual(3);
        //         done();
        //     }, 4000);
        // });



        // it('should push message 6 times if users are arrive 2 people', (done) => {
        //     var dataArray = [];
        //         var user2 = {
        //             "userId": "59011112",
        //             "name": "jib",
        //             "timestamp": 1562774750526,
        //             "location": "Dimension Data Office, Asok",
        
        //         };
        //         var user1 = {
        //             "userId": "59011113",
        //             "name": "jang",
        //             "timestamp": 1562774750526,
        //             "location": "Dimension Data Office, Asok",
        
        //         };
        
        //         conversationService.message_service.sendMessage = function mock_callback(userId, message) {
        //             dataArray.push({
        //                 toId: userId,
        //                 message: message
        //             });
        
        //         };
        //     conversationService.callback(user2.userId, user2.location, 0);
        //     conversationService.callback(user1.userId, user1.location, 0);

        //     setTimeout(() => {
        //         console.log(dataArray);
        //         expect(dataArray.length).toEqual(6);
        //         done();
        //     }, 4000);
        // });

    });
});