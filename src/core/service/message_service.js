const fs = require("fs");
const line = require('@line/bot-sdk');
const config = require('../config.js');
const local = require('../data_access_layer/local_file');
const user_exist = './resource/user.json';
const replyText = (token, texts) => {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
      token,
      texts.map((text) => ({ type: 'text', text }))
    );
  };
// create LINE SDK client
const client = new line.Client(config);
    module.exports = {
        
        send_message : function( event){
            
            client.getProfile(event.source.userId)
            .then((profile) => {
    
                
                if (fs.existsSync(user_exist)) {

                    var data = fs.readFileSync(user_exist);
                    var dataObj = JSON.parse(data);
                    console.log(dataObj.user.length);
                    
                    for(i = 0 ; i < dataObj.user.length ;i++){
                    if(dataObj.user[i].userID == event.source.userId){
                            
                             //Bot push message to spacific Line Group
                        client.pushMessage(config.ReportGroupId, send_FlexMessage(profile))
                       .then(() => {

                            local.saveActivity(event,profile);
                        
                        }).catch((err) => {});
                        }
                    }
              
           
                }

            return replyText(event.replyToken, 'Hello'+profile.displayName);  
            }).catch((err) => {});
          
        }
    }
    
        
    function send_FlexMessage(profile){
        
        let current_datetime = new Date()
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
                        "text": current_datetime.getDate() + "-" +(current_datetime.getMonth() + 1) +  "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes(),
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
                        "text": "Dimension Data Office, Asok",
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