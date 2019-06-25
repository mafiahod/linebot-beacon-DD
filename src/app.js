'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./core/config.js');
const conv = require('./core/service/conversation_service');
const beacon = require('./core/service/beacon_service');
const local = require('./core/data_access_layer/local_file');




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
      return conv.handle_in_Message(event);
    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'join':
      local.saveGroupId(event);
   
    case 'memberJoined':
      client.getProfile(event.source.userId)
        .then((profile) => {

         local.saveUser(event,profile);
    
      }).catch((err) => {});
    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);  

    case 'beacon':
      return beacon.handle_beacon_event(event);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

const port = config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

