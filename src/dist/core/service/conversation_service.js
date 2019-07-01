'use strict';

var _state = require('../model/state');

var reqiure_sendmessage = require('./message_service');
var local = require('../data_access_layer/local_file');
var call_activityInfo = require('../model/activity');
var save_activity = require('../model/activity');
var line = require('@line/bot-sdk');
var config = require('../config');
var client = new line.Client(config);

module.exports = {

    handle_in_Message: function handle_in_Message(message, userId, displayName, timestamp) {

        console.log('statesssssssssssss');
        //เรียกใช้ state เพื่อพิจารณาบอทยังไม่ได้ส่งคำถามไปแต่มีข้อความจากuserเข้ามา
        var Find_state = new states.state(userId, null, null, true); //userid,displayname,time,askstate
        var ask_state = local.operate.findInform(Find_state, null, 'none');

        console.log('looooooo');
        console.log(ask_state.length);

        for (i = 0; i < ask_state.length; i++) {
            console.log('state');
            if (ask_state[i].askstate == true) {
                //เป็นการเก็บactivityInfo เพิ่มเข้าไปในmodel acitivity

                var Save_plan = new save_activity.activityInfo(userId, null, null, null, "012c7cbf02", message.text);
                local.operate.saveInform(Save_plan);
                console.log(Save_plan);
                reqiure_sendmessage.send_message(message, userId);
            } else {

                var reenter = {
                    type: 'text',
                    text: 'i don\'t know what you meant'
                };

                //reply  i don't know what you meant
                client.pushMessage(config.ReportGroupId, reenter).then(function () {}).catch(function (err) {});
            }
        }
    },

    ask_today_plan: function ask_today_plan(userId, displayName, timestamp, location) {

        console.log('beacon test');

        // var Find_activityInfo = new call_activityInfo.activityInfo(event.source.userId, null, null,local.operate.getLocation(hwid), true);
        //  var finduser_activityInfo = local.operate.findInform(Find_activityInfo, null, true);

        var question = {
            type: 'text',
            text: 'what\'s your plan to do today at ' + location + ' ?'
        };

        client.pushMessage(userId, question).then(function () {

            var Save_state = new _state.State(userId, displayName, timestamp, true); //userid,displayname,time,askstate
            console.log("before save state");
            local.saveInform(Save_state);
            console.log("after save state");

            if (finduser_activityInfo[i].plan == null) {

                callback(message);
            }
        }).catch(function (err) {});
    },
    callback: function callback(message) {

        setTimeOut(function () {

            ask_today_plan(message);
        }, 3000);
    }

};