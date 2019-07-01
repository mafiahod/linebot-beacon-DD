'use strict';

var line = require('@line/bot-sdk');
var config = require('../config.js');
var local = require('../data_access_layer/local_file');
var find_activity = require('../model/activity');
var moment = require('moment');
var replyText = function replyText(token, texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(token, texts.map(function (text) {
        return { type: 'text', text: text };
    }));
};

// create LINE SDK client
var client = new line.Client(config);
module.exports = {

    send_message: function send_message(userId) {

        client.getProfile(userId).then(function (profile) {
            //Bot push message to spacific Line Group
            client.pushMessage(config.ReportGroupId, send_FlexMessage(profile)).then(function () {}).catch(function (err) {});
        }).catch(function (err) {});
    }
};

function send_FlexMessage(profile) {
    //เรียกactivity.jsonมาใช้ในการส่ง
    var Find_activityObj = new find_activity.activityInfo(event.source.userId, profile.displayName, 'in', event.timestamp, local.operate.getLocation(event.beacon.hwid), true);
    var user_activity = local.operate.findInform(Find_activityObj, null, true);

    var flexMessage = {
        "type": "flex",
        "altText": "this is a flex message",
        "contents": {
            "type": "bubble",
            "hero": {
                "type": "image",
                "url": profile.pictureUrl,
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "cover"
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "md",
                "contents": [{
                    "type": "text",
                    "text": profile.displayName,
                    "wrap": true,
                    "weight": "bold",
                    "gravity": "center",
                    "size": "xl"
                }, {
                    "type": "box",
                    "layout": "vertical",
                    "margin": "lg",
                    "spacing": "sm",
                    "contents": [{
                        "type": "box",
                        "layout": "baseline",
                        "spacing": "sm",
                        "contents": [{
                            "type": "text",
                            "text": "Date/Time",
                            "color": "#aaaaaa",
                            "size": "sm",
                            "flex": 1
                        }, {
                            "type": "text",
                            "text": moment(user_activity.timestamp).format('DD/MM/YYYY HH:mm:ss'),
                            "wrap": true,
                            "size": "sm",
                            "color": "#666666",
                            "flex": 4
                        }]
                    }, {
                        "type": "box",
                        "layout": "baseline",
                        "spacing": "sm",
                        "contents": [{
                            "type": "text",
                            "text": "Place",
                            "color": "#aaaaaa",
                            "size": "sm",
                            "flex": 1
                        }, {
                            "type": "text",
                            "text": local.operate.getLocation(event.beacon.hwid),
                            "wrap": true,
                            "color": "#666666",
                            "size": "sm",
                            "flex": 4
                        }]
                    }, {
                        "type": "box",
                        "layout": "baseline",
                        "spacing": "sm",
                        "contents": [{
                            "type": "text",
                            "text": "Place",
                            "color": "#aaaaaa",
                            "size": "sm",
                            "flex": 1
                        }, {
                            "type": "text",
                            "text": user_activity.plan,
                            "wrap": true,
                            "color": "#666666",
                            "size": "sm",
                            "flex": 4
                        }]
                    }]
                }]
            }
        }
    };

    return flexMessage;
}