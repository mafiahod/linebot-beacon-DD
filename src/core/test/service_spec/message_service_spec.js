'use strict';

import { Message_service } from '../../service/index'

var push = new Message_service();

// describe('push_message', () => {
//     it('show an error', () => {
var id = 234234;
const message = {
    type: 'text',
    text: 'i don\'t know what you mean'
};
console.log(push.push_Message("23131","dfssd"));
//         var err = 23;
//         console.log(push.push_Message(id,message));

//         expect(push.push_Message()).toEqual(err);
//     });
// });
