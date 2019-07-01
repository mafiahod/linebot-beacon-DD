const reqiure_sendmessage = require('./message_service');
const local = require('../data_access_layer/local_file');
const states = require('../model/state');
const call_activityInfo = require('../model/activity');
const save_activity = require('../model/activity');
const line = require('@line/bot-sdk');
const config = require('../config');
const client = new line.Client(config);


module.exports = {

    handle_in_Message: function (message,userId,displayName,timestamp) {


        
        console.log('statesssssssssssss');
        //เรียกใช้ state เพื่อพิจารณาบอทยังไม่ได้ส่งคำถามไปแต่มีข้อความจากuserเข้ามา
        var Find_state = new states.state(userId,null,null,true);//userid,displayname,time,askstate
        var ask_state = local.operate.findInform(Find_state, null,'none');

        console.log('looooooo');
        console.log(ask_state.length);

        for (i=0;i < ask_state.length ; i++) {
            console.log('state');
            if (ask_state[i].askstate == true) {
                //เป็นการเก็บactivityInfo เพิ่มเข้าไปในmodel acitivity
        
                var Save_plan = new save_activity.activityInfo(userId,null,null,null,"012c7cbf02",message.text);
                local.operate.saveInform(Save_plan);
                console.log(Save_plan);
                reqiure_sendmessage.send_message(message,userId);

            } else {

                const reenter = {
                    type: 'text',
                    text: 'i don\'t know what you meant'
                };

                //reply  i don't know what you meant
                client.pushMessage(config.ReportGroupId, reenter)
                    .then(() => {

                    }).catch((err) => { });

            }
        }

    },

    ask_today_plan: function (userId,timestamp,hwid,plan) {
        
        console.log('beacon test');

       // var Find_activityInfo = new call_activityInfo.activityInfo(event.source.userId, null, null,local.operate.getLocation(hwid), true);
      //  var finduser_activityInfo = local.operate.findInform(Find_activityInfo, null, true);
        
        const question = {
            type: 'text',
            text: 'what\'s your plan to do today at ' /*+ local.operate.getLocation(hwid)*/ +' ?'
        };

        client.pushMessage(userId, question)
            .then(() => {
                
                var Save_state = new states.state(userId,null,timestamp, true);//userid,displayname,time,askstate
                local.operate.saveInform(Save_state);
                

                if (finduser_activityInfo[i].plan == null) {

                    callback(message);

                }
            }).catch((err) => { });

    },
    callback: function (message) {


        setTimeOut(() => {

            ask_today_plan(message);

        }, 3000)

    }

}


