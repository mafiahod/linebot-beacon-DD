'use strict';
import {User} from './core/model/index'
import {LocalFile}  from './core/data_access_layer/index'
import {Beacon_service,Conversation_service} from './core/service/index'
import {Client,middleware} from '@line/bot-sdk'
import * as config from './core/config'
import {logger} from '../logs/logger'
const express = require('express');
//const config = require('./core/config.js');

// create LINE SDK client
const client = new Client(config);
const dal = new LocalFile();

const app = express();

const Conservationservice = new Conversation_service();
const Beaconservice = new Beacon_service();

// webhook callback
app.post('/webhook', middleware(config), (req, res) => {

  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(req.body.events.map(event => {
    logger.info(event);
    console.log('event', event); ////
    // check verify webhook event
    if (event.replyToken === '00000000000000000000000000000000' ||
      event.replyToken === 'ffffffffffffffffffffffffffffffff') {
      return;
    }
    return handleEvent(event);
  }))
    .then(() => res.end())
    .catch((err) => {
      logger.error(err);
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
         Conservationservice.handle_in_Message(event.message, event.source.userId, profile.displayName, event.timestamp);
        }).catch((err) => {   
             logger.error(err);
        });
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

          var saveUser = new User(event.joined.members[0].userId, profile.displayName);
        logger.info(saveUser);
          console.log(saveUser);////
         dal.save(saveUser);

        }).catch((err) => { 
          logger.error(err);
        });
      return;

    case 'memberLeft':
      return;

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'beacon':
      client.getProfile(event.source.userId)
        .then((profile) => {
          Beaconservice.handle_beacon_event(event.source.userId, profile.displayName, event.timestamp, event.beacon.hwid);
        }).catch((err) => { 
          logger.error(err);
        });
      return;


    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

const port = config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
