const message_ser =require('./message_service');
   
    module.exports = {

        handle_in_Message :function(event){
        const message = event.message; 
            switch (message.type) {
                case 'text':
                return message_ser.send_message(  event);
                default:
                throw new Error(`Unknown message: ${JSON.stringify(message)}`);
            }
        }
    }


   

        