"use strict";
import { State, Activity } from '../model/index'
import {LocalFile} from '../data_access_layer/index'
import { Message_service } from './index'
//import { send_message, Me } from './index'




//handle when messages were sent
function handle_in_Message(message, userId, displayName, timestamp) {

    var Find_state = new State(userId, null, null, null, null); //Find out which state is asked or not.
    var ask_state = this.dal.find(Find_state, 1, true);

    for (var i = 0; i < ask_state.length; i++) {

        if (ask_state.length == 0) {
            const not_ask = {
                type: 'text',
                text: 'i don\'t know what you mean'
            };

            this.message_service.push_Message(userId, not_ask);

        } else {

            var Find_answer = new Activity(userId, null, null, null, null, null);  //find the activity of the user by userid 
            var answer = this.dal.find(Find_answer, 1, true);


            if (answer[i].plan == 'none') {  //if plan parameter equals to none then updated an answer with incomeing message  
                var update_answer_from_user = new Activity(userId, null, null, null, null, message.text);
                this.dal.save(update_answer_from_user);

                this.message_service.send_Message(message, userId);
            }
            else if (answer[i].plan != 'none') {


                const answered = {
                    type: 'text',
                    text: 'you answered the question'
                };
                this.message_service.push_Message(userId, answered);
            }
        }
    }

}

function ask_today_plan(userId, displayName, timestamp, location) { //send the question to users

    
    const question = {
        type: 'text',
        text: 'what\'s your plan to do today at ' + location + ' ?'
    };
    
    this.message_service.push_Message(userId, question);
    
    var Update_state = new State(userId, displayName, timestamp, location, true);
    this.dal.save(Update_state);

    this.callback(userId, location);

}

let count = 0;

function callback(userId, location) {  //handle when users do not answer question within 15 seconds


    setTimeout(() => {

        var Check_answer = new Activity(userId, null, null, null, location, null);
        var check_ans = this.dal.find(Check_answer, null, true);

        if (check_ans[0].plan == 'none' && count < 3) {

            const enter_message = {
                type: 'text',
                text: 'Please enter your answer'
            };
            this.message_service.push_Message(userId, enter_message);

            count++;
            this.callback(userId, location);

        } else if (check_ans[0].plan == 'none' && count == 3) {

            const message = '           ';

            var Update_answer = new Activity(userId, null, null, null, null, message);
            this.dal.save(Update_answer);
            this.message_service.send_Message(message, userId);

        }
        else if (check_ans[0].plan != 'none') {
            console.log("exist loop from conver,callback");
            return;
        }
    }, 15000)

}

class Conversation_service {
    constructor() {
        this.ask_today_plan = ask_today_plan;
        this.callback = callback;
        this.handle_in_Message = handle_in_Message;
        this.message_service = new Message_service();
        this.dal = new LocalFile();
    }

}
export {
    Conversation_service
}