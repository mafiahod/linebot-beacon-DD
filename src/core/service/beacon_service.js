const line = require('@line/bot-sdk');
const config = require('../config.js');
const getFlexMessage = require('./message_service');
// create LINE SDK client
const client = new line.Client(config);

module.exports = {
    
    handle_beacon_event :function(event){

        switch (event.type) {
          
            case 'join':
              global.informGroupId = event.source.groupId;
              return replyText(event.replyToken, `Joined ${event.source.type} ${global.informGroupId}`);
              
            case 'leave':
              return console.log(`Left: ${JSON.stringify(event)}`);
            
            case 'beacon':
              return getFlexMessage.send_message(event);
        
            default:
              throw new Error(`Unknown event: ${JSON.stringify(event)}`);
          }
        }
      }

          
      
  
    
   