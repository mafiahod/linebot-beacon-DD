"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.callback = exports.ask_today_plan = exports.handle_in_Message = undefined;

var _index = require('../model/index');

var _index2 = require('../data_access_layer/index');

var _index3 = require('../service/index');

var _fs = require('fs');

var line = require('@line/bot-sdk');
var config = require('../config');
var client = new line.Client(config);

function handle_in_Message(message, userId, displayName, timestamp) {

    console.log('find state from conver');

    var Find_state = new _index.State(userId, null, null, null, null); //userid,displayname,time,askstate
    var ask_state = (0, _index2.findInform)(Find_state, null, true);
    console.log(ask_state);
    for (var i = 0; i < ask_state.length; i++) {

        if (ask_state[i].askstate != 'none') {
            //เป็นการเก็บactivityInfo เพิ่มเข้าไปในmodel acitivity

            var Save_plan = new _index.Activity(userId, null, null, null, null, message.text);
            (0, _index2.saveInform)(Save_plan);
            console.log(Save_plan);

            (0, _index3.send_message)(message, userId);
        } else {

            var reenter = {
                type: 'text',
                text: 'i don\'t know what you meant'
            };

            //reply  i don't know what you meant
            client.pushMessage(userId, reenter).then(function () {}).catch(function (err) {});
        }
    }
}

function ask_today_plan(userId, displayName, timestamp, location) {

    console.log('beacon test from conver');

    var question = {
        type: 'text',
        text: 'what\'s your plan to do today at ' + location + ' ?'
    };

    client.pushMessage(userId, question).then(function () {

        var Update_state = new _index.State(userId, displayName, timestamp, location, true); //userid,displayname,time,askstate
        console.log("before update state from conver");
        (0, _index2.saveInform)(Update_state);
        console.log(Update_state);
        console.log("after update state from conver");

        callback(userId, location);
    }).catch(function (err) {});
}

var count = 0;

function callback(userId, location) {

    console.log("Hello from conver,callback");
    var Check_answer = new _index.Activity(userId, null, null, null, location, null); //ทำการเช็คว่ามีด

    var check_ans = (0, _index2.findInform)(Check_answer, null, true);
    console.log("check_ans from conver,callback");
    console.log(check_ans);

    if (check_ans[0].plan == 'none' && count <= 3) {
        console.log("check_ans[0].plan  from conver,callback");
        console.log(check_ans[0].plan);
        console.log("if before set timout from conver,callback");
        a = setTimeout(function () {
            var question = {
                type: 'text',
                text: 'Pease enter your answer'
            };
            console.log("push message again from conver,callback");
            client.pushMessage(userId, question).then(function () {}).catch(function (err) {});

            console.log(count);
            count++;
            console.log(count);
            callback(userId, location);
        }, 15000);
    } else if (check_ans[0].plan != 'none') {
        console.log("exist loop from conver,callback");
        clearTimeout(a);
        return;
    }
}
exports.handle_in_Message = handle_in_Message;
exports.ask_today_plan = ask_today_plan;
exports.callback = callback;