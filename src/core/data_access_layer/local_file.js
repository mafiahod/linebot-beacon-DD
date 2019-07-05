"use strict";
import {User,State,Activity} from '../model/index'
import * as fs from 'fs'

const current_datetime = new Date();
const activityDir = './resource/' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';
const userDir = './resource/user.json';
const locationDir = './resource/location.json';
const stateDir = './resource/state-' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';


function save(obj) {
    if (obj instanceof Activity) {
        var presentDir = activityDir;
    } else if (obj instanceof User) {
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
   


        if (obj.plan != 'none' && obj.plan != undefined) {
      
            for (var i = 0; i < dataArray.length; i++) {
              
                if (dataArray[i].userId == obj.userId) {
                    dataArray[i].plan = obj.plan;
                }
            }
        } else if ((obj.plan == 'none' || obj.plan == undefined) &&( obj.askstate == undefined || obj.askstate == 'none')) {        //append activity or user in exist file
       
            dataArray.push(obj);
        }
        else if (obj.askstate == true) {        //append activity or user in exist file
            for (var i = 0; i < dataArray.length; i++) {
                if (dataArray[i].userId == obj.userId && dataArray[i].location == obj.location) {
                   
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
}


function find(obj, count, desc) {
    var presentDir;
    if (obj instanceof Activity) {
        presentDir = activityDir;
    } else if (obj instanceof User) {
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

}



function getLocation(hwid) {
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

export{save , find , getLocation}