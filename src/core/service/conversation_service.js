"use strict";
import { State, Activity } from '../model/index'
import * as dal from '../data_access_layer/index'
import { send_message } from '../service/index'
import { exists } from 'fs';

const line = require('@line/bot-sdk');
const config = require('../config');
const client = new line.Client(config);

function handle_in_Message(message, userId, displayName, timestamp) {



    var Find_state = new State(userId, null, null, null, null);
    var ask_state = dal.find(Find_state, null, true);
    console.log('find state from conver');
    console.log(ask_state);


    for (var i = 0; i < ask_state.length; i++) {

        if (ask_state.length == 0) {
            const not_ask = {
                type: 'text',
                text: 'i don\'t know what you mean'
            };

            client.pushMessage(userId, not_ask)
                .then(() => {

                }).catch((err) => { });

        } else {

            var Find_answer = new Activity(userId, null, null, null, null, null);
            var answer = dal.find(Find_answer, null, true);
            console.log('find answer  from conver');
            console.log(answer);
      
            if (answer[i].plan == 'none') {  //เป็นการเก็บคำตอบของuserเพิ่มเข้าไปในmodel acitivity
                var update_answer_from_user = new Activity(userId, null, null, null, null, message.text);
                dal.save(update_answer_from_user);
                console.log(update_answer_from_user);

                send_message(message, userId);

            }
            else if (answer[i].plan != 'none') {

    
                const message = {
                    type: 'text',
                    text: 'you answered the question'
                };

                client.pushMessage(userId, message)
                    .then(() => {

                    }).catch((err) => { });

            }
        }
    }

}

function ask_today_plan(userId, displayName, timestamp, location) {


    const question = {
        type: 'text',
        text: 'what\'s your plan to do today at ' + location + ' ?'
    };

    client.pushMessage(userId, question)
        .then(() => {

            var Update_state = new State(userId, displayName, timestamp, location, true);
            dal.save(Update_state);
            console.log("after update state from conver");
            console.log(Update_state);


            callback(userId, location);


        }).catch((err) => { });


}

let count = 0;

function callback(userId, location) {


    setTimeout(() => {

        console.log("Hello from conver,callback");
        var Check_answer = new Activity(userId, null, null, null, location, null);//ทำการเช็คว่ามีคำตอบหรือไม่
        var check_ans = dal.find(Check_answer, null, true);
        console.log("check_ans from conver,callback");
        console.log(check_ans);

        if (check_ans[0].plan == 'none' && count < 3) {

            const question = {
                type: 'text',
                text: 'Pease enter your answer'
            };

            client.pushMessage(userId, question)
                .then(() => {
                }).catch((err) => { });

            count++;
            callback(userId, location);

        } else if (check_ans[0].plan == 'none' && count == 3) {

            const message = '           ';

            var Update_answer = new Activity(userId, null, null, null, null, message);
            dal.save(Update_answer);
            send_message(message, userId);

        }
        else if (check_ans[0].plan != 'none') {
            console.log("exist loop from conver,callback");
            return;
        }
    }, 15000)

}
export {
    handle_in_Message, ask_today_plan, callback
}