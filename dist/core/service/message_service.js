"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.send_message = undefined;

var _index = require('../model/index');

var _index2 = require('../data_access_layer/index');

var line = require('@line/bot-sdk');
var config = require('../config.js');

var moment = require('moment');
var replyText = function replyText(token, texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(token, texts.map(function (text) {
        return { type: 'text', text: text };
    }));
};

// create LINE SDK client
var client = new line.Client(config);

function send_message(message, userId) {

    console.log('send flexmessage');

    client.getProfile(userId).then(function (profile) {
        //Bot push message to spacific Line Group
        client.pushMessage(config.ReportGroupId, send_FlexMessage(message, userId, profile)).then(function () {}).catch(function (err) {});
    }).catch(function (err) {});
}

function send_FlexMessage(message, userId, profile) {
    //เรียกactivity.jsonมาใช้ในการส่ง
    var query_useractivity = new _index.Activity(userId, null, null, null, null, null);
    var query_activity = (0, _index2.findInform)(query_useractivity, 1, true);
    console.log("data that send to flexmessage");
    console.log(query_activity);
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
                            "text": "Date",
                            "color": "#aaaaaa",
                            "size": "sm",
                            "flex": 1
                        }, {
                            "type": "text",
                            "text": moment(query_activity[0].timestamp).format('DD/MM/YYYY HH:mm:ss'),
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
                            "text": query_activity[0].location,
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
                            "text": "Ans",
                            "color": "#aaaaaa",
                            "size": "sm",
                            "flex": 1
                        }, {
                            "type": "text",
                            "text": query_activity[0].plan,
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

exports.send_message = send_message;