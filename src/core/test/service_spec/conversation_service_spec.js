'use strict';
import { Conversation_service } from '../../service/index'
var push = new Conversation_service();

describe('callback', () => {


    it('should push message even late reply ',(done) => {

        var check_ans = [];
        var activity = {
            "userId": "U9f12e85f8a0d10571a4af43eacd9e127",
            "name": "..BALL..",
            "type": "in",
            "timestamp": 1562774750526,
            "location": "Dimension Data Office, Asok",
            "askstate": true,
            "plan": "none"
        };
        check_ans.push(activity);
       
        var resultArray = [];
       

        push.message_service.send_Message = function mock_sendMessage(id, message) {
           
            
            resultArray.push({
                toId: id,
                message: message
            });

        };


        let count = 0;

        push.callback = function mock_callback(check_ans) {


          
       
            setTimeout(() => {
                
                if(count == 2 ){

                    activity.plan = "work";

                }
                if (check_ans[0].plan == 'none' && count < 3) {

                    push.message_service.send_Message("1234", "hello");

                    count++;

                    push.callback(check_ans);

                } else if (check_ans[0].plan != 'none') {
                    console.log("exist loop from conver,callback");
                    return;
                }


            }, 1000)

        };
       
        
      
        push.callback(check_ans);
      
        setTimeout(() => {
            console.log(resultArray);
            expect(resultArray).toEqual([ { toId : '1234', message : 'hello' }, { toId : '1234', message : 'hello' } ]);
            done();
         
            }, 4000);
       
         
         

    });
});
