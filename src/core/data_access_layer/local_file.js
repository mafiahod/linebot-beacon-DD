"use strict";
import { User, Activity } from '../model/index'
import * as fs from 'fs'
import * as _ from 'lodash'
import { logger } from '../../../logs/logger';

const current_datetime = new Date();
const defactivityDir = './resource/' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + '.json';
const defuserDir = './resource/user.json';

function save(obj) {   //ต้องเป็น Object ที่ได้มาจากการ new Object จาก Model เท่านั้น
    var presentDir;
    if (obj instanceof Activity) {
        presentDir = this.activityDir;
    } else if (obj instanceof User) {
        presentDir = this.userDir;
    } else {
        logger.info("Unknow location to save");
    }
    if (fs.existsSync(presentDir)) {                //handle when file is existed
        var data = fs.readFileSync(presentDir);
        var dataArray = JSON.parse(data);

        //append activity or user in exist file
        dataArray.push(obj);
        fs.writeFileSync(presentDir, JSON.stringify(dataArray, null, 4), (err) => {
            if (err) {
                logger.error(err);
                return;
            };
        });
    } else {                      //Create new activity.json or user.json
        var dataArray = [];
        dataArray.push(obj);
        if (!(fs.existsSync('./resource'))) {
            fs.mkdir('./resource', function (err) {     //Create directory
                if (err) {
                    return logger.error(err);
                }
            });
        }
        fs.writeFileSync(presentDir, JSON.stringify(dataArray, null, 4), (err) => {
            if (err) {
                logger.error(err);
                return;
            };
        });
    }
}


// obj เป็น object ที่ต้องการหาโดย new มาจาก Model , replace ถ้าใส่ค่า true จะทำการทับข้อมูลเก่าด้วย obj (paramiter แรก) ,
// act เป็น object ที่บอกว่าจะ update ข้อมูลตัวไหน ได้จากการใช้ function find หาออกมาเป็น Array of Object
function update(obj, replace, act) {    
    var presentDir;
    if (obj instanceof Activity) {
        presentDir = this.activityDir;
    } else if (obj instanceof User) {
        presentDir = this.userDir;
    } else {
        logger.info("Unknow location to find ");
    }
    if (act.length == 0) return console.log("Can not find anything to update");
    if (fs.existsSync(presentDir)) {
        var data = fs.readFileSync(presentDir);
        var dataArray = JSON.parse(data);
        var tempArray = [];
        for (var i in dataArray) {
            var temp = new obj.constructor();
            for (var property in obj) {
                temp[property] = dataArray[i][property];
            }
            tempArray.push(temp);
        }
        for (var i in tempArray) {
            for (var j in act) {
                if (_.isEqual(tempArray[i], act[j])) {      //comparison between 2 object with lodash lib
                    if (replace == true) {
                        tempArray[i] = obj;
                    } else if (replace != true) {
                        for (var property in obj) {
                            if (obj[property] != null) {
                                tempArray[i][property] = obj[property];
                            }
                        }
                    }
                    break;
                }
            }
        }
        fs.writeFileSync(presentDir, JSON.stringify(tempArray, null, 4), (err) => {
            if (err) {
                logger.error(err);
                return;
            };
        });

    } else {
        logger.info("There is no file to update");
    }

}



function find(obj, count, desc) {

    var presentDir;
    if (obj instanceof Activity) {
        presentDir = this.activityDir;
    } else if (obj instanceof User) {
        presentDir = this.userDir;
    } else {
        logger.info("Unknow location to find ");
    }
    if (fs.existsSync(presentDir)) {
        var data = fs.readFileSync(presentDir);
        var dataArray = JSON.parse(data);
        var resultArray = [];
        if (count == null) {
            count = dataArray.length;
        }
        for (var i in dataArray) {
            var temp = new obj.constructor();
            var check_flag = true;
            for (var property in obj) {
                if (obj[property] != null && obj[property] != dataArray[i][property]) {
                    check_flag = false;
                    break;
                }
                else {
                    temp[property] = dataArray[i][property];
                }
            }
            if (check_flag) resultArray.push(temp);
        }
        if (desc == true) {                //desc เป็น property ที่ใช้เรียงตาม เวลา เก่าไปใหม่ หรือ ใหม่ไปเก่า เท่านั้น
            resultArray.reverse();
        }
        return resultArray.slice(0, count);
    } else {
        return [];
    }

}



class LocalFile {
    constructor(activityDir = defactivityDir, userDir = defuserDir) {
        this.save = save;
        this.find = find;
        this.update = update;
        this.activityDir = activityDir;
        this.userDir = userDir;
    }
}

export { LocalFile }