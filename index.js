'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./config.json');
//var bodyParser = require('body-parser');

// create LINE SDK client
const client = new line.Client(config);

const app = express();


// webhook callback
app.post('/webhook', line.middleware(config), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(req.body.events.map(event => {

    console.log('event', event);
    // check verify webhook event
    if (event.replyToken === '00000000000000000000000000000000' ||
      event.replyToken === 'ffffffffffffffffffffffffffffffff') {
      return;
    }


    return handleEvent(event);
  }))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

// callback function to handle a single event
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken , event);
        case 'image':
          return handleImage(message, event.replyToken);
        case 'video':
          return handleVideo(message, event.replyToken);
        case 'audio':
          return handleAudio(message, event.replyToken);
        case 'location':
          return handleLocation(message, event.replyToken);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      global.informGroupId = event.source.groupId;
      return replyText(event.replyToken, `Joined ${event.source.type} ${global.informGroupId}`);
      
    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'beacon':
        client.getProfile(event.source.userId).then((profile) => {

          //push message to specific Line Group
          client.pushMessage(event.source.userId, getFlexMessage(profile))
          .then(() => {}).catch((err) => {});

          //Bot reply greet message in bot chat
          return replyText(event.replyToken, "สวัสดี "+profile.displayName+" เวลา ");

        }).catch((err) => {});

        return 0;

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}


function handleText(message, replyToken, event) {
  
  client.getProfile(event.source.userId)
  .then((profile) => {

    //Bot push message to spacific Line Group
    client.pushMessage(event.source.userId, getFlexMessage(profile))
      .then(() => {}).catch((err) => {});
    
    //Bot reply greet message in bot chat
    return replyText(replyToken, "สวัสดี "+profile.displayName + " กรุ๊ป " );
        
  }).catch((err) => {});
      
}

function handleImage(message, replyToken) {
  return replyText(replyToken, 'Got Image');
}

function handleVideo(message, replyToken) {
  return replyText(replyToken, 'Got Video');
}

function handleAudio(message, replyToken) {
  return replyText(replyToken, 'Got Audio');
}

function handleLocation(message, replyToken) {
  return replyText(replyToken, 'Got Location');
}

function handleSticker(message, replyToken) {
  return replyText(replyToken, 'Got Sticker');
}

function getFlexMessage(profile){
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

const port = config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
