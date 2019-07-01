'use strict';

var _activity = require('../model/activity');

var _state = require('../model/state');

var _user = require('../model/user');

var fs = require("fs");
var current_datetime = new Date();
var activityDir = './resource/' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';
var userDir = './resource/user.json';
var locationDir = './resource/location.json';
var stateDir = './resource/state-' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';

module.exports = {

    saveInform: function saveInform(obj) {
        console.log(obj);
        console.log("start Dir");
        if (obj instanceof _activity.Activity) {
            var presentDir = activityDir;
        } else if (obj instanceof _user.Userinfo) {
            var presentDir = userDir;
        } else if (obj instanceof _state.State) {
            var presentDir = stateDir;
        } else {
            console.log("Unknow location to save");
        }
        console.log(presentDir);
        if (fs.existsSync(presentDir)) {
            console.log("start exist file"); //handle when file is existed
            var data = fs.readFileSync(presentDir);
            var dataArray = JSON.parse(data);
            console.log(dataArray);
            if (obj.plan != 'none' && obj.plan != undefined) {
                //update property 'plan' in exist activity
                console.log("none Loop");
                console.log(dataArray.length);
                console.log(obj.plan);
                for (i = 0; i < dataArray.length; i++) {
                    if (dataArray[i].userId == obj.userId && dataArray[i].location == obj.location) {
                        dataArray[i].plan = obj.plan;
                        console.log("update plan");
                    }
                }
            } else if (obj.plan == 'none' || obj.plan == undefined) {
                //append activity or user in exist file
                dataArray.push(obj);
                console.log("just push");
            }
            fs.writeFileSync(presentDir, JSON.stringify(dataArray, null, 4), function (err) {
                if (err) {
                    console.error(err);
                    return;
                };
                console.log("already write");
            });
        } else {
            //Create new activity.json or user.json
            console.log("start create file");
            var dataArray = [];
            dataArray.push(obj);
            fs.writeFileSync(presentDir, JSON.stringify(dataArray, null, 4), function (err) {
                if (err) {
                    console.error(err);
                    return;
                };
            });
        }
    },

    findInform: function findInform(obj, count, desc) {
        var presentDir;
        if (obj instanceof _activity.Activity) {
            presentDir = activityDir;
        } else if (obj instanceof _user.Userinfo) {
            presentDir = userDir;
        } else if (obj instanceof _state.State) {
            presentDir = stateDir;
        } else {
            console.log("Unknow location to find");
        }
        if (fs.existsSync(presentDir)) {
            var data = fs.readFileSync(presentDir);
            var dataArray = JSON.parse(data);
            var resultArray = [];
            var propCount = 0;
            var equalProp = 0;
            if (count == null) {
                count = dataArray.length;
            }
            for (var i in dataArray) {
                for (var property in obj) {
                    if (obj[property] != null) {
                        propCount++;
                        console.log("propcount +");
                        if (obj[property] == dataArray[i][property]) {
                            equalProp++;
                            console.log("equal +");
                        }
                    }
                    console.log(propCount);
                    console.log(equalProp);
                }
                if (equalProp == propCount) {
                    resultArray.push(dataArray[i]);

                    console.log("Enter comparison");
                }
                propCount = 0;
                equalProp = 0;
            }
            if (desc == true) {
                resultArray.reverse();
            }
            return resultArray.slice(0, count);
        } else {
            return [];
        }
    },

    getLocation: function getLocation(hwid) {
        console.log(hwid);
        if (fs.existsSync(locationDir)) {
            console.log("Enter exist");
            var data = fs.readFileSync(locationDir);
            var dataArray = JSON.parse(data);
            console.log(dataArray);
            for (var i in dataArray) {
                console.log("enter for loop");
                if (dataArray[i].hardwareID == hwid) {
                    return dataArray[i].LocationName;
                }
            }
        } else {
            console.log("No Location File");
        }
    }
};