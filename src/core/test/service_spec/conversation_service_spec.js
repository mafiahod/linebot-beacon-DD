'use strict';

import { Conversation_service } from '../../service/index'

var push = new Conversation_service();

describe('callback', () => {


    it('should push message even late reply ', (done) => {


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


        let count = 0;
        push.callback = function mock_callback(check_ans) {


            setTimeout(() => {

                if (check_ans[0].plan == 'none' && count < 3) {

                    count++;
                    push.callback(check_ans);
                   
                } 
                done();

            }, 1000)
        };

        push.callback(check_ans);
        expect(count).tobr(3);
    });




    // async.it('should push message even late reply ', (done) => {

    //     var check_ans = [];
    //     var activity = {
    //         "userId": "U9f12e85f8a0d10571a4af43eacd9e127",
    //         "name": "..BALL..",
    //         "type": "in",
    //         "timestamp": 1562774750526,
    //         "location": "Dimension Data Office, Asok",
    //         "askstate": true,
    //         "plan": "none"
    //     };
    //     check_ans.push(activity);

    //     let count = 0;
    //     push.callback = function mock_callback(check_ans) {

    //         setTimeout(() => {
    //             if (count == 2) {
    //                 check_ans[0].plan = "Answered";
    //             }

    //             if (check_ans[0].plan == 'none' && count < 3) {

    //                 count++;
    //                 push.callback(check_ans);
    //             }

    //             else if (count == 2 && check_ans[0].plan != 'none') {
    //                 console.log(count);
    //                 expect(count).toEqual("3333");
    //             }

    //             done();
    //         }, 1000)
    //     };

    //     push.callback(check_ans);
    //     console.log(count);
    // });







});
