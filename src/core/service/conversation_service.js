import { State } from '../model/state'
import { Activity } from '../model/activity'

const reqiure_sendmessage = require('./message_service');
const local = require('../data_access_layer/local_file');
const line = require('@line/bot-sdk');
const config = require('../config');
const client = new line.Client(config);


module.exports = {
    handle_in_Message: function (message, userId, displayName, timestamp) {

        console.log('find state');

        var Find_state = new State(userId, null, null, null, null);//userid,displayname,time,askstate
        var ask_state = local.findInform(Find_state, null, true);
        console.log(ask_state);
        for (var i = 0; i < ask_state.length; i++) {

            if (ask_state[i].askstate != 'none') {  //เป็นการเก็บactivityInfo เพิ่มเข้าไปในmodel acitivity

                var Save_plan = new Activity(userId, null, null, null, null, message.text);
                local.saveInform(Save_plan);
                console.log(Save_plan);

                reqiure_sendmessage.send_message(message, userId);

            } else {

                const reenter = {
                    type: 'text',
                    text: 'i don\'t know what you meant'
                };

                //reply  i don't know what you meant
                client.pushMessage(userId, reenter)
                    .then(() => {

                    }).catch((err) => { });

            }
        }

    },

    ask_today_plan: function (userId, displayName, timestamp, location, callback) {

        console.log('beacon test');

        const question = {
            type: 'text',
            text: 'what\'s your plan to do today at ' + location + ' ?'
        };

        client.pushMessage(userId, question)
            .then(() => {

                var Update_state = new State(userId, displayName, timestamp, location, true);//userid,displayname,time,askstate
                console.log("before update state");
                local.saveInform(Update_state);
                console.log(Update_state);
                console.log("after update state");



                console.log("Check_answer");

                var Check_answer = new Activity(userId, null, null, null, location, 'none');//ทำการเช็คว่ามีด
                console.log(Check_answer);
                console.log("check_ans");
                var check_ans = local.findInform(Check_answer, null, true);
                console.log(check_ans);

                if (check_ans[0].plan == 'none') {

                    console.log("333333333333333333333333333333333333333333333333333333333333333333333")
                    callback(userId,location);

                }


            }).catch((err) => { });


    }

}

let check = false;
let count = 0;


function callback(userId,location) {
 
    
    if (count == 3) check = true;
    if (check == false && count <= 3) {
        setTimeout(() => {
            const question = {
                type: 'text',
                text: 'what\'s your plan to do today at ' + location + ' ?'
            };
    
            client.pushMessage(userId, question)
            .then(() => {
            }).catch((err) => { });

            console.log(count);
            count++;
            console.log(count);
            callback(userId,location);

        }, 3000)
    } else if (check == true) {
        console.log("Complete");
    }
}
