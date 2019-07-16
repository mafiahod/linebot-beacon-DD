'use strict';

import { Message_service } from '../../service/index'
import { Client } from '@line/bot-sdk'
import * as config from '../../config'

var push = new Message_service();
const moment = require('moment');

describe('message_service', () => {
    it('should send message to userId when called', () => {
        var pushCalled;
        push.client.pushMessage = function mock_sendMessage(id, message) {

            pushCalled = {
                toId: id,
                message: message
            };
        };
        push.send_Message("1234", "hello");
        expect(pushCalled.toId).toEqual("1234");
        expect(pushCalled.message).toEqual("hello");
    }),


    it('should match the data and position with original data', () => {
        const pushCalled1 = [];
        var profile = {
            userId: 'Ub182adba86d289c7154a6963e725c4f5',
            displayName: 'jam',
            pictureUrl: 'https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e'
        };
        var activity = [{
            userId: "Ub182adba86d289c7154a6963e725c4f5",
            name: "jam",
            type: "in",
            timestamp: "1562834628816",
            location: "Test2",
            plan: "none"
        }];

        pushCalled1.push(push.create_Walkinmessage(profile, activity));

        expect(pushCalled1[0].contents.hero.url).toEqual('https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e');
        expect(pushCalled1[0].contents.body.contents[0].text).toEqual("jam");
        expect(pushCalled1[0].contents.body.contents[1].contents[0].contents[1].text).toEqual(moment("1562834628816").format('DD/MM/YYYY HH:mm'));
        expect(pushCalled1[0].contents.body.contents[1].contents[1].contents[1].text).toEqual('Test2');
        expect(pushCalled1[0].contents.body.contents[1].contents[2].contents[1].text).toEqual('none');


    });
});