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

                reqiure_sendmessage.send_message(message,userId);

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

                var Check_ans = new Activity(userId, null, null, null, local.getLocation(hwid), 'none');
                console.log(Check_ans);
                var Check_answer = local.findInform(Check_ans, null, true);


                for (var i = 0; i < Check_answer.length; i++) {

                    if (Check_answer[i].plan == 'none') {

                        callback(userId, displayName, timestamp, location);

                    }

                }
            }).catch((err) => { });

    },
    callback: function () {


        setTimeOut(() => {

            ask_today_plan(userId, displayName, timestamp, location, callback);

        }, 3000)

    }

}


