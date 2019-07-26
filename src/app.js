'use strict';
import { User } from './core/model/index'
import { LocalFile } from './core/data_access_layer/index'
import { Beacon_service, Conversation_service, Elastic_service } from './core/service/index'
import { Client, middleware } from '@line/bot-sdk'
import * as config from './core/config'
import { logger, Log_config } from '../logs/logger'

const express = require('express');
const app = express();
const logconfig = Log_config;               //const config = require('./core/config.js');
const client = new Client(config);          // create LINE SDK client
const dal = new LocalFile();
const elastic = new Elastic_service();
const Conservationservice = new Conversation_service();
const Beaconservice = new Beacon_service();

// webhook callback
app.post('/webhook', middleware(config), (req, res) => {

  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    logger.error(res);
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
      return Conservationservice.handle_in_Message(event.message, event.source.userId);

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'join':
      console.log(event.source.groupId);
      return;

    case 'memberJoined':
      client.getProfile(event.joined.members[0].userId)
        .then((profile) => {
          var saveUser = new User(event.joined.members[0].userId, profile.displayName);
         // elastic.elasticsave(saveUser);
          dal.save(saveUser);
          logger.info(saveUser);
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
          Beaconservice.handle_beacon_event(event.source.userId, profile.displayName, event.timestamp, event.beacon.hwid,profile.pictureUrl);
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
