"use strict";
import { State, Activity } from '../model/index'
import { findInform, saveInform } from '../data_access_layer/index'
import { send_message } from '../service/index'
import { exists } from 'fs';

const line = require('@line/bot-sdk');
const config = require('../config');
const client = new line.Client(config);

function handle_in_Message(message, userId, displayName, timestamp) {

    console.log('find state from conver');

    var Find_state = new State(userId, null, null, null, null);//userid,displayname,time,askstate
    var ask_state = findInform(Find_state, null, true);
    console.log(ask_state);
    for (var i = 0; i < ask_state.length; i++) {

        if (ask_state[i].askstate != 'none') {  //เป็นการเก็บactivityInfo เพิ่มเข้าไปในmodel acitivity

            var Save_plan = new Activity(userId, null, null, null, null, message.text);
            saveInform(Save_plan);
            console.log(Save_plan);

            send_message(message, userId);

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

}

function ask_today_plan(userId, displayName, timestamp, location) {

    console.log('beacon test from conver');

    const question = {
        type: 'text',
        text: 'what\'s your plan to do today at ' + location + ' ?'
    };

    client.pushMessage(userId, question)
        .then(() => {

            var Update_state = new State(userId, displayName, timestamp, location, true);//userid,displayname,time,askstate
            console.log("before update state from conver");
            saveInform(Update_state);
            console.log(Update_state);
            console.log("after update state from conver");


            callback(userId, location);


        }).catch((err) => { });


}

let count = 0;

function callback(userId, location) {


    setTimeout(() => {
        console.log("Hello from conver,callback");
        var Check_answer = new Activity(userId, null, null, null, location, null);//ทำการเช็คว่ามีด

        var check_ans = findInform(Check_answer, null, true);
        console.log("check_ans from conver,callback");
        console.log(check_ans);

        if (check_ans[0].plan == 'none' && count <= 3) {
            console.log("check_ans[0].plan  from conver,callback");
            console.log(check_ans[0].plan);
            console.log("if before set timout from conver,callback");

            const question = {
                type: 'text',
                text: 'Pease enter your answer'
            };
            console.log("push message again from conver,callback");
            client.pushMessage(userId, question)
                .then(() => {
                }).catch((err) => { });

            console.log(count);
            count++;
            console.log(count);
            callback(userId, location);

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