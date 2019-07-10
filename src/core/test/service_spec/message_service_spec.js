'use strict';

import { Message_service } from '../../service/index'

var push = new Message_service();
var id = "6454n43h43590bgq";
const message = {
    type: 'text',
    text: 'i don\'t know what you mean'
};
const message1 = {
    type: null,
    text: 'i don\'t know what you mean'
};

describe('push_message', () => {
    it('should return 200 OK', () => {
        expect(push.push_Message(id,message)).toEqual("200 OK");

    });

    it('should  return 400', () => {
        expect(push.push_Message(id, message1)).toEqual("400");

    });
});
