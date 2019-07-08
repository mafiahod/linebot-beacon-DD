"use strict";
import { State, Activity } from '../model/index'
import * as dal from '../data_access_layer/index'
import { send_message, push_message } from './index'
import { Client } from '@line/bot-sdk'
import * as config from '../config'


const client = new Client(config);


//handle when messages were sent
function handle_in_Message(message, userId, displayName, timestamp) {

    var Find_state = new State(userId, null, null, null, null); //Find out which state is asked or not.
    var ask_state = dal.find(Find_state, 1, true);

    for (var i = 0; i < ask_state.length; i++) {

        if (ask_state.length == 0) {
            const not_ask = {
                type: 'text',
                text: 'i don\'t know what you mean'
            };

            return push_message(userId, not_ask);

        } else {

            var Find_answer = new Activity(userId, null, null, null, null, null);  //find the activity of the user by userid 
            var answer = dal.find(Find_answer, 1, true);


            if (answer[i].plan == 'none') {  //if plan parameter equals to none then updated an answer with incomeing message  
                var update_answer_from_user = new Activity(userId, null, null, null, null, message.text);
                dal.save(update_answer_from_user);

                return send_message(message, userId); 

            }
            else if (answer[i].plan != 'none') {


                const answered = {
                    type: 'text',
                    text: 'you answered the question'
                };

                return push_message(userId, answered);

            }
        }
    }

}

function ask_today_plan(userId, displayName, timestamp, location) { //send the question to users


    const question = {
        type: 'text',
        text: 'what\'s your plan to do today at ' + location + ' ?'
    };

    push_message(userId, question);

    var Update_state = new State(userId, displayName, timestamp, location, true);
    dal.save(Update_state);

    callback(userId, location);

}

let count = 0;

function callback(userId, location) {  //handle when users do not answer question within 15 seconds


    setTimeout(() => {

        var Check_answer = new Activity(userId, null, null, null, location, null);
        var check_ans = dal.find(Check_answer, null, true);

        if (check_ans[0].plan == 'none' && count < 3) {

            const enter_message = {
                type: 'text',
                text: 'Please enter your answer'
            };

            push_message(userId,enter_message);

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