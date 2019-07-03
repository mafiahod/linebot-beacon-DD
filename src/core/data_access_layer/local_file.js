"use strict";
import {Userinfo,State,Activity} from '../model/index'
const fs = require("fs");
const current_datetime = new Date();
const activityDir = './resource/' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';
const userDir = './resource/user.json';
const locationDir = './resource/location.json';
const stateDir = './resource/state-' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';


module.exports = {

    saveInform: function (obj) {
        if (obj instanceof Activity) {
            var presentDir = activityDir;
        } else if (obj instanceof Userinfo) {
            var presentDir = userDir;
        } else if (obj instanceof State) {
            var presentDir = stateDir;
        } else {
            console.log("Unknow location to save");
        }
        console.log(presentDir);
        if (fs.existsSync(presentDir)) {                //handle when file is existed
            var data = fs.readFileSync(presentDir);
            var dataArray = JSON.parse(data);
            console.log('obj.askstate from local');
            console.log(obj.askstate);
            console.log('obj.plan from local');
            console.log(obj.plan);

            console.log(JSON.stringify(obj));

            if (obj.plan != 'none' && obj.plan != undefined) {
                console.log('enter if  from local');
                for (var i = 0; i < dataArray.length; i++) {
                    console.log('enter for from local');
                    console.log(dataArray[i].userId);
                    console.log(dataArray[i].location);
                    console.log(obj.location);
                    if (dataArray[i].userId == obj.userId) {
                        console.log('enter second if  from local');
                        dataArray[i].plan = obj.plan;///
                    }
                }
            } else if ((obj.plan == 'none' || obj.plan == undefined) &&( obj.askstate == undefined || obj.askstate == 'none')) {        //append activity or user in exist file
                console.log(JSON.stringify(obj));
                dataArray.push(obj);
            }
            else if (obj.askstate == true) {        //append activity or user in exist file
                for (var i = 0; i < dataArray.length; i++) {
                    if (dataArray[i].userId == obj.userId && dataArray[i].location == obj.location) {
                        console.log('update from local');
                        dataArray[i].askstate = obj.askstate;
                    }
                }
            }
            fs.writeFileSync(presentDir, JSON.stringify(dataArray, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
            });
        } else {                      //Create new activity.json or user.json
            var dataArray = [];
            dataArray.push(obj);
            fs.writeFileSync(presentDir, JSON.stringify(dataArray, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
            });
        }
    },


    findInform: function (obj, count, desc) {
        var presentDir;
        if (obj instanceof Activity) {
            presentDir = activityDir;
        } else if (obj instanceof Userinfo) {
            presentDir = userDir;
        } else if (obj instanceof State) {
            presentDir = stateDir;
        } else {
            console.log("Unknow location to find ");
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
                        if (obj[property] == dataArray[i][property]) {
                            equalProp++;
                        }
                    }
                }
                if (equalProp == propCount) {
                    resultArray.push(dataArray[i]);
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



    getLocation: function (hwid) {
        if (fs.existsSync(locationDir)) {
            var data = fs.readFileSync(locationDir);
            var dataArray = JSON.parse(data);
            for (var i in dataArray) {
                if (dataArray[i].hardwareID == hwid) {
                    return dataArray[i].LocationName;
                }
            }

        } else {
            console.log("No Location File");
        }

    }
}