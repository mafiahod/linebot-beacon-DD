"use strict";
import { Activity } from '../model/index'
import { Client, middleware } from '@line/bot-sdk'
import { LocalFile } from '../data_access_layer/index'
import * as config from '../config'
import { logger } from '../../../logs/logger'
//import 'moment'
const moment = require('moment');

const dal = new LocalFile();



function send_message(id, message_content) {

    var promise = new Promise((resolve, reject) => {
       //Bot push message to user
    this.client.pushMessage(id, message_content);
    resolve();
    reject();

     });
    
        promise.then(() => {
            console.log(id);
            console.log(message_content);
      
        })
        promise.catch((err) => {
            logger.error(err);
        });


}

function sendwalkin_message(userId) {

    var query_useractivity = new Activity(userId, null, null, null, null, null, null);
    var query_activity = dal.find(query_useractivity, 1, true);/////
    logger.info(query_activity);


    this.client.getProfile(userId)
        .then((profile) => {

            //Bot push message to specific Line Group
            this.client.pushMessage(config.ReportGroupId, this.create_Walkinmessage(profile, query_activity))
                .then(() => {
                }).catch((err) => {
                    logger.error(err);
                });

        }).catch((err) => {
            logger.error(err);
        });


}


function create_walkinMessage(profile, query_activity) {//format of the sent message 
    
    console.log(profile);
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
                                        "text": moment(query_activity[0].timestamp).format('DD/MM/YYYY HH:mm'),
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
        this.client = new Client(config);
        this.send_Message = send_message;
        this.sendwalkin_Message = sendwalkin_message;
        this.create_Walkinmessage = create_walkinMessage;
    }
}
export {
    Message_service
}