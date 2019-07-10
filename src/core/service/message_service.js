"use strict";
import { Activity } from '../model/index'
import { Client, middleware } from '@line/bot-sdk'
import { LocalFile } from '../data_access_layer/index'
import * as config from '../config'
import { logger } from '../../../logs/logger'
//import 'moment'
const moment = require('moment');

// create LINE SDK client
const client = new Client(config);
const dal = new LocalFile();



function push_message(id, message_content) {

    if ((id != 'none' || id != null || id != undefined) && (message_content.type == 'text') && (message_content.text != 'none' || message_content.text != null || message_content.text != undefined)) {
        console.log("success");//ต้องเขียนคำสั่งให้push
        return "200 OK"
    } else {
        console.log("error");
        return "400";
    }

    // client.pushMessage(id, message_content)

    //     .then(() => {
    //         return "200 OK";
    //     }).catch((err) => {
    //         logger.error(err);
    //         console.log(err);

    //     })

}


function send_message(message, userId) {

    console.log('send flexmessage');
    client.getProfile(userId)
        .then((profile) => {
            //Bot push message to specific Line Group
            client.pushMessage(config.ReportGroupId, send_FlexMessage(message, userId, profile))
                .then(() => {

                }).catch((err) => {
                    logger.error(err);
                });

        }).catch((err) => {
            logger.error(err);
        });

}



function send_FlexMessage(message, userId, profile) {//format of the sent message 
    var query_useractivity = new Activity(userId, null, null, null, null, null);
    var query_activity = dal.find(query_useractivity, 1, true);/////
    logger.info(query_activity);
    console.log(query_activity);
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
class Message_service {
    constructor() {
        this.send_Message = send_message;
        this.push_Message = push_message;
        this.send_FlexMessage = send_FlexMessage;
    }
}
export {
    Message_service
}