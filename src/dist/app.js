'use strict';

var _user = require('./core/model/user');

var line = require('@line/bot-sdk');
var express = require('express');
var config = require('./core/config.js');
var conv = require('./core/service/conversation_service');
var beacon = require('./core/service/beacon_service');
var local = require('./core/data_access_layer/local_file');

// create LINE SDK client
var client = new line.Client(config);

var app = express();

// webhook callback
app.post('/webhook', line.middleware(config), function (req, res) {

  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(req.body.events.map(function (event) {

    console.log('event', event);
    // check verify webhook event
    if (event.replyToken === '00000000000000000000000000000000' || event.replyToken === 'ffffffffffffffffffffffffffffffff') {
      return;
    }
    return handleEvent(event);
  })).then(function () {
    return res.end();
  }).catch(function (err) {
    console.error(err);
    res.status(500).end();
  });
});

// simple reply function
var replyText = function replyText(token, texts) {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(token, texts.map(function (text) {
    return { type: 'text', text: text };
  }));
};

// callback function to handle a single event
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      return conv.handle_in_Message(event);
    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log('Unfollowed this bot: ' + JSON.stringify(event));

    case 'postback':
      var data = event.postback.data;
      return replyText(event.replyToken, 'Got postback: ' + data);

    case 'join':
      local.saveGroupId(event);
      return;

    case 'memberJoined':
      client.getProfile(event.joined.members[0].userId).then(function (profile) {

        var saveUser = new _user.Userinfo(event.joined.members[0].userId, profile.displayName);
        console.log(saveUser);
        local.saveInform(saveUser);
      }).catch(function (err) {});
      return;

    case 'memberLeft':
      return;

    case 'leave':
      return console.log('Left: ' + JSON.stringify(event));

    case 'beacon':
      client.getProfile(event.source.userId).then(function (profile) {

        beacon.handle_beacon_event(event.source.userId, profile.displayName, event.timestamp, event.beacon.hwid);
      }).catch(function (err) {});
      return;

    default:
      throw new Error('Unknown event: ' + JSON.stringify(event));
  }
}

var port = config.port;
app.listen(port, function () {
  console.log('listening on ' + port);
});