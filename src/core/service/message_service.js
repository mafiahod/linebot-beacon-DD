"use strict";
import { Activity } from '../model/index'
import * as dal from '../data_access_layer/index'
import { Client, middleware } from '@line/bot-sdk'
import * as config from '../config'
//import 'moment'
const moment = require('moment');

// create LINE SDK client
const client = new Client(config);


function push_message(id, message_content) {

    client.pushMessage(id, message_content)
        .then(() => {

        }).catch((err) => { });

}

function send_message(message, userId) {

    console.log('send flexmessage');
    client.getProfile(userId)
        .then((profile) => {
            //Bot push message to specific Line Group
            client.pushMessage(config.ReportGroupId, send_FlexMessage(message, userId, profile))
                .then(() => {

                }).catch((err) => { });

        }).catch((err) => { });

}



function send_FlexMessage(message, userId, profile) {//format of the sent message 
    var query_useractivity = new Activity(userId, null, null, null, null, null);
    var query_activity = dal.find(query_useractivity, 1, true);
    const flexMessage = {
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
                "contents": [
                    {
                        "type": "text",
                        "text": profile.displayName,
                        "wrap": true,
                        "weight": "bold",
                        "gravity": "center",
                        "size": "xl"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": "lg",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "Date",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 1
                                    },
                                    {
                                        "type": "text",
                                        "text": moment(query_activity[0].timestamp).format('DD/MM/YYYY HH:mm:ss'),
                                        "wrap": true,
                                        "size": "sm",
                                        "color": "#666666",
                                        "flex": 4
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "Place",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 1
                                    },
                                    {
                                        "type": "text",
                                        "text": query_activity[0].location,
                                        "wrap": true,
                                        "color": "#666666",
                                        "size": "sm",
                                        "flex": 4
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "Ans",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 1
                                    },
                                    {
                                        "type": "text",
                                        "text": query_activity[0].plan,
                                        "wrap": true,
                                        "color": "#666666",
                                        "size": "sm",
                                        "flex": 4
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    };

    return flexMessage;
}
class Message_service{
    constructor(){
    this.sendMessage= send_message;
    this.push_Massage= push_message;
    }
}
export {
    Message_service
}