'use strict';

import { LocalFile } from '../../data_access_layer'
import { Activity, State, User } from '../../model'
import fs from 'fs'
import rimraf from 'rimraf'
const current_datetime = new Date();
const testpath = './src/core/test/data_access_layer_spec/test_file/';



const daltest = new LocalFile(testpath,[Activity]);
describe('LocalFile', () => {

    it('save() should write obj to file correctly', () => {
        if (fs.existsSync(testpath)) rimraf.sync(testpath);
        var userFilePath = daltest.getSaveFilePath(User);
        var activityFilePath = daltest.getSaveFilePath(User);
        daltest.save(new User('59010126', 'Ball'));
        expect(daltest.getObjFileContent(User)).withContext(`Never add obj; file:${userFilePath} should contain 1 obj`).toEqual([{userId:'59010126',name:'Ball'}]);
        daltest.save(new User('59010127', 'Jah'));
        expect(daltest.getObjFileContent(User)).withContext(`1 obj already save; file:${userFilePath} should contain 2 obj`).toEqual([{name:'Ball',userId:'59010126'},{userId:'59010127',name:'Jah'}]);
        rimraf.sync(testpath);
        daltest.save(new User('59010126', 'Ball'));
        expect(daltest.getObjFileContent(User)).withContext(`Remove save dir and save a new obj; file:${userFilePath} should contain a new obj`)
        daltest.save(new Activity('59010126', 'Ball', 'in', '123456789', 'Test', true, '222'));
        expect(daltest.getObjFileContent(User)).withContext(`save obj different class, previous class file:${userFilePath} should not be affected`).toEqual([{userId:'59010126',name:'Ball'}]);
        expect(daltest.getObjFileContent(Activity)).withContext(`save another class previous class file: ${activityFilePath} should contains different obj`).toEqual([{userId : '59010126', name :  'Ball', type : 'in', timestamp :  '123456789',location : 'Test', askstate : true, plan : '222'}]);
    });


    it('find() will return array with user data that has userid following in find', () => {
        if (fs.existsSync(testpath)) {
            rimraf.sync(testpath);
        }
        var check = [];
        var testSaveUser = new User('59010126', 'Ball');
        var testSaveUser2 = new User('59011234', 'Jam');
        var testSaveUser3 = new User('59010654', 'Jah');
        daltest.save(testSaveUser);
        daltest.save(testSaveUser2);
        daltest.save(testSaveUser3);
        check.push(testSaveUser);
        var testFind_activityObj = new User('59010126', null);
        var testFind = daltest.find(testFind_activityObj, null, true);
        expect(testFind.length).toEqual(1);
        for (var i in testFind) {
            expect(testFind[i]).toEqual(check[i]);
        }
    });


    it('find will return array with only user data that has name == Ball', () => {
        if (fs.existsSync(testpath)) {
            rimraf.sync(testpath);
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
        if (fs.existsSync(testpath)) {
            rimraf.sync(testpath);
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
        if (fs.existsSync(testpath)) {
            rimraf.sync(testpath);
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


    it('should update new Answer to wanted activity', () => {
        if (fs.existsSync(testpath)) {
            rimraf.sync(testpath);
        }
        var checkArray = [];
        var testSaveActivity = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', true, '666');
        var testSaveActivity2 = new Activity('59010126', 'Ball', 'in', '665456789', 'Test55', true, 'free');
        var two = new Activity('8888', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work2');
        var three = new Activity('3333', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work3');
        var four = new Activity('4444', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work4');
        daltest.save(testSaveActivity);
        daltest.save(testSaveActivity2);
        daltest.save(two);
        daltest.save(three);
        daltest.save(four);
        var testfindobj = new Activity('59010126',null,null,null,null,null,null);
        var testupdateobj = new Activity(null,null,null,null,null,null,'gotoPlay');

        daltest.update(testupdateobj,null,testfindobj);

        var mustbe = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', true, 'gotoPlay');
        var mustbe2 = new Activity('59010126', 'Ball', 'in', '665456789', 'Test55', true, 'gotoPlay');
        checkArray.push(mustbe);
        checkArray.push(mustbe2);
        var findobj2 = new Activity('59010126',null,null,null,null,null,null);
        var find2 = daltest.find(findobj2,null,null);
        expect(find2.length).toEqual(2);
        for(var i in find2){
            expect(find2[i]).toEqual(checkArray[i]);
        }
    });

    it('should replace whole activity property', () => {
        if (fs.existsSync(testpath)) {
            rimraf.sync(testpath);
        }
        var testSaveActivity = new Activity('59010126', 'Ball', 'in', '123456789', 'Test', true, '666');
        var testSaveActivity2 = new Activity('59010126', 'Ball', 'in', '665456789', 'Test55', true, 'free');
        var two = new Activity('8888', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work2');
        var three = new Activity('3333', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work3');
        var four = new Activity('4444', 'AAAAAA', 'in', '123456789', 'Test', true, 'Work4');
        daltest.save(testSaveActivity);
        daltest.save(testSaveActivity2);
        daltest.save(two);
        daltest.save(three);
        daltest.save(four);
        
        var testfindobj = new Activity('59010126',null,null,null,null,null,null);

        var testupdateobj = new Activity('59010126',null,null,null,null,null,'gotoPlay');
        daltest.update(testupdateobj,true,testfindobj);

        var mustbe = new Activity('59010126',null,null,null,null,null, 'gotoPlay');
        var findobj2 = new Activity('59010126',null,null,null,null,null,null);
        var find2 = daltest.find(findobj2,null,null);
        expect(find2.length).toEqual(2);
        for(var i in find2){
            expect(find2[i]).toEqual(mustbe);
        }
    });

});
