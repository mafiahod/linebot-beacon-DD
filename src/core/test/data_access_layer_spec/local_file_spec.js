'use strict';

import { LocalFile } from '../../data_access_layer/index'
import { Activity, State, User } from '../../model/index'
import * as fs from 'fs'

const current_datetime = new Date();
const activitysavepath = './src/core/test/data_access_layer_spec/test_file/save/' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';
const usersavepath = './src/core/test/data_access_layer_spec/test_file/save/user.json';
const statesavepath = './src/core/test/data_access_layer_spec/test_file/save/state-' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';
const activityfindpath = './src/core/test/data_access_layer_spec/test_file/find/' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';
const userfindpath = './src/core/test/data_access_layer_spec/test_file/find/user.json';
const statefindpath = './src/core/test/data_access_layer_spec/test_file/find/state-' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';

const dalforsave = new LocalFile(activitysavepath, usersavepath, statesavepath);
const dalforfind = new LocalFile(activityfindpath, userfindpath, statefindpath);

describe('answer', () => {

    it('find will return state data', () => {
        var testFind_activityObj = new State('59010126', null , null , null , null);
        var testFind = dalforfind.find(testFind_activityObj, null, true);
        expect(testFind).toEqual([
            {
                "userId": "59010126",
                "name": "Ball",
                "time": "123456789",
                "location": "Here",
                "askstate": "none"
            }
        ]);
    });


    it('find will return only data in specific location', () => {
        var testFind_activityObj = new Activity('59010126', null, null, null, 'Test2', null);
        var testFind = dalforfind.find(testFind_activityObj, null, true);
        expect(testFind).toEqual([
            {
                "userId": "59010126",
                "name": "Ball",
                "type": "in",
                "timestamp": "123456789",
                "location": "Test2",
                "plan": "none"
            }
        ]);
    });   
    
    
    it('find will return array with data in file', () => {
        var testFind_activityObj = new Activity('59010126', null, null, null, null, null);
        var testFind = dalforfind.find(testFind_activityObj, null, true);
        expect(testFind).toEqual([
            {
                "userId": "59010126",
                "name": "Ball",
                "type": "in",
                "timestamp": "123456789",
                "location": "Test2",
                "plan": "none"
            },
            {
                "userId": "59010126",
                "name": "Ball",
                "type": "in",
                "timestamp": "123456789",
                "location": "Test",
                "plan": "none"
            }
        ]);
    });


    it('save will create state file if There is no exist file or append data if file is created', () => {
        var testSavestate = new State('59010126', 'Ball', '123456789', 'Here', 'none');
      dalforsave.save(testSavestate);
        var check = fs.readFileSync(statesavepath);
        var dataArray = JSON.parse(check);
        for (var i in dataArray) {
            if (dataArray[i] === testSavestate) {
                expect(dataArray[i]).toEqual(testSavestate);
            }
        }
    });

    it('save will create user file if There is no exist file or append data if file is created', () => {
        var testSaveUser = new User('59010126', 'Ball');
        dalforsave.save(testSaveUser);
        var check = fs.readFileSync(usersavepath);
        var dataArray = JSON.parse(check);
        for (var i in dataArray) {
            if (dataArray[i] === testSaveUser) {
                expect(dataArray[i]).toEqual(testSaveUser);
            }
        }
    });


    it('save will create activity file if There is no exist file or append data to exist file', () => {
        var testSaveActivity = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', 'none');
        dalforsave.save(testSaveActivity);
        var check = fs.readFileSync(activitysavepath);
        var dataArray = JSON.parse(check);
        for (var i in dataArray) {
            if (dataArray[i] === testSaveActivity) {
                expect(dataArray[i]).toEqual(testSaveActivity);
            }
        }
    });
    



});
