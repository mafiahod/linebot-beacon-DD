'use strict';
import {Userinfo} from '../model/index'
import {findInform,saveInform,getLocation} from './core/data_access_layer/index'
import {handle_beacon_event,handle_in_Message} from './core/service/index'
const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./core/config.js');

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
      client.getProfile(event.source.userId)
        .then((profile) => {
          handle_in_Message(event.message, event.source.userId, profile.displayName, event.timestamp);
        }).catch((err) => { });
      return;

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'join':
      return;

    case 'memberJoined':
      client.getProfile(event.joined.members[0].userId)
        .then((profile) => {

          var saveUser = new Userinfo(event.joined.members[0].userId, profile.displayName);
          console.log(saveUser);
          saveInform(saveUser);

        }).catch((err) => { });
      return;

    case 'memberLeft':
      return;

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'beacon':
      client.getProfile(event.source.userId)
        .then((profile) => {
          
          /*var Saveactivity = new Activity(event.source.userId, profile.displayName, 'in', event.timestamp,
            getLocation(event.beacon.hwid), 'none');
          saveInform(Saveactivity);


          var Savestate = new State(event.source.userId, profile.displayName, event.timestamp,getLocation(event.beacon.hwid), 'none');//userid,displayname,time,askstate
          saveInform(Savestate);*/

          handle_beacon_event(event.source.userId, profile.displayName, event.timestamp, event.beacon.hwid);




        }).catch((err) => { });
      return;


    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

const port = config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
