'use strict';

import { LocalFile } from '../../data_access_layer/index'
import { Activity, State, User } from '../../model/index'
import * as fs from 'fs'

const current_datetime = new Date();
const path = './src/core/test/data_access_layer_spec/' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';
const dal = new LocalFile();

describe('answer', () => {
    it('find will return array with data in file', () => {
        var testFind_activityObj = new Activity('59010126', null, null, null, null, null);  // Find user activity and state
        var testFind = dal.find(testFind_activityObj, null, true);






        expect(testFind.length).toEqual(10);
    });

    it('save will create file if There is no exist activity file', () => {
        var testSaveActivity = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', 'none');
        dal.save(testSaveActivity);
        console.log(dal.activityDir);
        console.log(dal.userDir);
        console.log(dal.stateDir);
        expect(fs.existsSync(path)).toEqual(true);
    });

    it('save will append data to exist activity file', () => {
        var testSaveActivity = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', 'none');
        dal.save(testSaveActivity);
        var check = fs.readFileSync(path);
        var dataArray = JSON.parse(check);
        for (var i in dataArray) {
            if (dataArray[i] === testSaveActivity) {
                expect(dataArray[i]).toEqual(testSaveActivity);
            }
        }
    });




});
