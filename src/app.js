(function () {'use strict';}());
import { User, Activity } from './core/model';
import { LocalFile } from './core/data_access_layer';
import { ConversationService, ElasticService, BeaconService, MessageService } from './core/service';
import { Client, middleware } from '@line/bot-sdk';
import { logger, Log_config } from './logger';
import config from './core/config';
const express = require('express');

const app = express();
const logconfig = Log_config;               //const config = require('./core/config.js');
const client = new Client(config);          // create LINE SDK client
const dal = new LocalFile(null,[Activity]);
const elastic = new ElasticService();
const messageService = new MessageService(new Client(config));
const conversationService = new ConversationService(dal,messageService,elastic);
const beaconService = new BeaconService(conversationService,messageService,dal,elastic);

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
      return conversationService.handleInMessage(event.message, event.source.userId);

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return logger.info(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'join':
      return;

    case 'memberJoined':
      client.getProfile(event.joined.members[0].userId)
        .then((profile) => {
          var saveUser = new User(event.joined.members[0].userId, profile.displayName);
          elastic.elasticsave(saveUser);
          dal.save(saveUser);
          logger.info(saveUser);
        }).catch((err) => {
          logger.error(err);
        });
      return;

    case 'memberLeft':
      return;

    case 'leave':
      return logger.info(`Left: ${JSON.stringify(event)}`);

    case 'beacon':
      client.getProfile(event.source.userId)
        .then((profile) => {
          beaconService.handleBeaconEvent(event.source.userId, profile.displayName, event.timestamp, event.beacon.hwid,profile.pictureUrl);
        }).catch((err) => {
          logger.error(err);
        });
      return;

    default:
      logger.error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

app.listen(config.port, () => {
  logger.info(`listening on ${config.port}`);
});
