const fs = require("fs");
const ActivityModel = require('../model/activity');
const UserModel = require('../model/user');
const StateModel = require('../model/state');
const current_datetime = new Date();
const activityDir = './resource/' + current_datetime.getDate() + "-" +(current_datetime.getMonth() + 1) +  "-" + current_datetime.getFullYear()+'.json';
const userDir = './resource/user.json';
const locationDir = './resource/location.json';
const stateDir = './resource/state ' + current_datetime.getDate() + "-" +(current_datetime.getMonth() + 1) +  "-" + current_datetime.getFullYear()+'.json';


module.exports = {
    
    saveInform: function(obj){
        if(obj instanceof ActivityModel){
            var presentDir = activityDir;
        }else if(obj instanceof UserModel){
            var presentDir = userDir;
        }else if(obj instanceof StateModel){
            var presentDir = stateDir;
        }else{
            console.log("Unknow location to save");
        }
        if(fs.existsSync(presentDir)) {                //handle when file is existed
            var data = fs.readFileSync(presentDir);
            var dataArray = JSON.parse(data);
            if(obj.plan != 'none'){                       //update property 'plan' in exist activity
                for(i=0 ; i<dataArray.length ; i++){
                    if(dataArray[i].userId == obj.userId && dataArray[i].location == obj.location){
                        dataArray[i].plan = obj.plan;
                    }
                }
            }else if(obj.plan == 'none' || obj.plan == undefined){        //append activity or user in exist file
                dataArray.push(obj);
            }
            fs.writeFileSync(presentDir,JSON.stringify(dataArray, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
            });
        }else{                      //Create new activity.json or user.json
            var dataArray = [];
            dataArray.push(obj);
            fs.writeFileSync(presentDir,JSON.stringify(dataArray, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
            });
        }
    },

    
    findInform: function(obj,count,desc){
        if(obj instanceof ActivityModel){
            var presentDir = activityDir;
        }else if(obj instanceof UserModel){
            var presentDir = userDir;
        }else if(obj instanceof StateModel){
            var presentDir = stateDir;
        }else{
            console.log("Unknow location to find");
        }
        if(fs.existsSync(presentDir)) {
            var data = fs.readFileSync(presentDir);
            var dataArray = JSON.parse(data);
            var resultArray = [];
            var propCount = 0;
            var equalProp =0;
            if(count == null){
                count = dataArray.length;
            }
            for(i in dataArray){
                for(property in obj){
                    if(obj[property] == dataArray[i][property]){
                        equalProp++;
                    }
                    if(obj[property] != null){
                        propCount++;
                    }
                }
                if(equalProp == propCount){
                    resultArray.push(dataArray[i]);
                    propCount = 0;
                    equalProp = 0;
                }
            }
            if(desc == true){
                resultArray.reverse();
            }
            return resultArray.slice(0,count);
        }else{
            console.log("There is no file to find");
        }

    },



    getLocation: function(hwid){
        if(fs.existsSync(locationDir)) {
            var data = fs.readFileSync(presentDir);
            var dataArray = JSON.parse(data);
            for(var i in dataArray){
                if(dataArray[i].hardwareID == hwid){
                    return dataArray[i].LocationName;
                }
            }

        }else{
            console.log("No Location File");
        }

    }
}
