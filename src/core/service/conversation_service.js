"use strict";
import { Activity } from '../model/index'
import { LocalFile } from '../data_access_layer/index'
import { Message_service, Elastic_service } from './index'
import { setTimeout } from 'timers';
//import { send_message, Me } from './index'


//handle when messages were sent
function handle_in_Message(message, userId) {
    var Find_state = new Activity(userId, null, null, null, null, true, null,null); //Find out which state is asked or not.
    var ask_state = this.dal.find(Find_state, 1, true);
    for (var i = 0; i < ask_state.length; i++) {
    
            var Find_answer = new Activity(userId, null, null, null, null, null, null,null);  //find the activity of the user by userid 
            var answer = this.dal.find(Find_answer, 1, true);

            if (answer[i].plan == 'none') {  //if plan parameter equals to none then updated an answer with incomeing message 
                var update_answer_from_user = new Activity(userId, null, null, null, "Dimension Data Office, Asok", null, message.text,null);
                this.elastic.elasticupdate(update_answer_from_user,"plan");
                this.dal.update(update_answer_from_user, null, answer);
              
                this.message_service.sendwalkin_Message(userId);
            }
            else if (answer[i].plan != 'none') {
                const answered = {
                    type: 'text',
                    text: 'you answered the question'
                };
                this.message_service.send_Message(userId, answered);
            
        }
    }

}

function ask_today_plan(userId, location) { //send the question to users
    const question = {
        type: 'text',
        text: 'what\'s your plan to do today at ' + location + ' ?'
    };
    this.message_service.send_Message(userId, question);
console.log("++++++++++++++++++++++++++++++");
    var find_act = new Activity(userId, null, null, null, location, null, null,null);
    var find_obj = this.dal.find(find_act, null, true);
    var Update_act = new Activity(userId, null, null, null, location, true, null,null);
    //setTimeout(() => {
    this.elastic.elasticupdate(Update_act,"askstate")
        

    //},2000)
    this.dal.update(Update_act, null, find_obj);
    this.callback(userId, location, 0);
    

}


function callback(userId, location, count) {  //handle when users do not answer question within 15 seconds
    setTimeout(() => {
        var Check_answer = new Activity(userId, null, null, null, location, null, null,null);
        var check_ans = this.dal.find(Check_answer, null, true);

        if (check_ans[0].plan == 'none' && count < 3) {
            const enter_message = {
                type: 'text',
                text: 'Please enter your answer'
            };
            this.message_service.send_Message(userId, enter_message);
            count++;
            this.callback(userId, location, count);

        } else if (check_ans[0].plan == 'none' && count == 3) {
            const message = '           ';
            var Update_answer = new Activity(userId, null, null, null, location, null, message,null);
            this.elastic.elasticupdate(Update_answer,"plan");
            this.dal.update(Update_answer, null, check_ans);
            this.message_service.sendwalkin_Message(userId);
        }
        else if (check_ans[0].plan != 'none') {
            console.log("exist loop from conver,callback");
            return;
        }
    }, 1000)
}

class Conversation_service {
    constructor() {
        this.ask_today_plan = ask_today_plan;
        this.callback = callback;
        this.handle_in_Message = handle_in_Message;
        this.message_service = new Message_service();
        this.elastic = new Elastic_service();
        this.dal = new LocalFile();
    }

}
export {
    Conversation_service
}