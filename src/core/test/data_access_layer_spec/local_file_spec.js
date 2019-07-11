'use strict';

import { LocalFile } from '../../data_access_layer/index'
import { Activity, State, User } from '../../model/index'
import * as fs from 'fs'

const current_datetime = new Date();
const activitytestpath = './src/core/test/data_access_layer_spec/test_file/' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';
const usertestpath = './src/core/test/data_access_layer_spec/test_file/user.json';

const daltest = new LocalFile(activitytestpath, usertestpath);

describe('answer', () => {



    it('save will create user file if There is no exist file or append data if file is created', () => {
        if (fs.existsSync(usertestpath)) {
            fs.unlinkSync(usertestpath);
        }
        var testSaveUser = new User('59010126', 'Ball');
        daltest.save(testSaveUser);
        var check = fs.readFileSync(usertestpath);
        var dataArray = JSON.parse(check);
        for (var i in dataArray) {
            if (dataArray[i] === testSaveUser) {
                expect(dataArray[i]).toEqual(testSaveUser);
            }
        }
    });


    it('save will create activity file if There is no exist file or append data to exist file', () => {
        if (fs.existsSync(activitytestpath)) {
            fs.unlinkSync(activitytestpath);
        }
        var testSaveActivity = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', true, '222');
        daltest.save(testSaveActivity);
        var check = fs.readFileSync(activitytestpath);
        var dataArray = JSON.parse(check);
        for (var i in dataArray) {
            if (dataArray[i] === testSaveActivity) {
                expect(dataArray[i]).toEqual(testSaveActivity);
            }
        }
    });




    it('find will return array with user data that has userid following in find', () => {
        if (fs.existsSync(usertestpath)) {
            fs.unlinkSync(usertestpath);
        }
        var check = [];
        var testSaveUser = new User('59010126', 'Ball');
        var testSaveUser2 = new User('59010122', 'Jah');
        daltest.save(testSaveUser);
        daltest.save(testSaveUser2);
        check.push(testSaveUser);
        var testFind_activityObj = new User('59010126', null);
        var testFind = daltest.find(testFind_activityObj, null, true);
        expect(testFind.length).toEqual(1);
        for (var i in testFind) {
            expect(testFind[i]).toEqual(check[i]);
        }
    });


    it('find will return array with only user data that has name == Ball', () => {
        if (fs.existsSync(usertestpath)) {
            fs.unlinkSync(usertestpath);
        }
        var check = [];
        var testSaveUser = new User('59010126', 'Ball');
        var testSaveUser2 = new User('59011234', 'Jam');
        var testSaveUser3 = new User('59010654', 'Jah');
        daltest.save(testSaveUser);
        daltest.save(testSaveUser2);
        daltest.save(testSaveUser3);
        check.push(testSaveUser);
        var testFind_activityObj = new User(null, 'Ball');
        var testFind = daltest.find(testFind_activityObj, null, true);
        expect(testFind.length).toEqual(1);
        for (var i in testFind) {
            expect(testFind[i]).toEqual(testSaveUser);
        }
    });



    it('find will return array with activity data that has userid following in find and sort by oldest to slastest', () => {
        if (fs.existsSync(activitytestpath)) {
            fs.unlinkSync(activitytestpath);
        }
        var check = [];
        var testSaveActivity = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', true, '555');
        var testSaveActivity2 = new Activity('59010126', 'Ball', 'in', '123432189', 'Try', true, 'Work');
        var testSaveActivity3 = new Activity('59010234', 'Jam', 'in', '123122289', 'Fight', true, 'clone');
        daltest.save(testSaveActivity);
        daltest.save(testSaveActivity2);
        daltest.save(testSaveActivity3);
        check.push(testSaveActivity);
        check.push(testSaveActivity2);
        var testFind_activityObj = new Activity('59010126', null, null, null, null, null, null);
        var testFind = daltest.find(testFind_activityObj, null, null);
        expect(testFind.length).toEqual(2);
        for (var i in testFind) {
            expect(testFind[i]).toEqual(check[i]);
        }
    });



    it('find will return only 2 newest activity data (2 last data saved)', () => {
        if (fs.existsSync(activitytestpath)) {
            fs.unlinkSync(activitytestpath);
        }
        var checkArray = [];
        var testSaveActivity = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', true, '666');
        var two = new Activity('8888', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work');
        var three = new Activity('3333', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work');
        var four = new Activity('4444', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work');
        daltest.save(testSaveActivity);
        daltest.save(two);
        daltest.save(three);
        daltest.save(four);
        checkArray.push(four);
        checkArray.push(three);
        var testFind_activityObj = new Activity(null, null, null, null, null , null, null);
        var testFind = daltest.find(testFind_activityObj, 2, true);

        expect(testFind.length).toEqual(2);
        for (var i in testFind) {
            expect(testFind[i]).toEqual(checkArray[i]);
        }
    });

});
