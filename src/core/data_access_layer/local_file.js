const fs = require("fs");
const ActivityModel = require('../model/activity');
const UserModel = require('../model/user');
const ConditionModel = require('../model/');
const current_datetime = new Date();
const activityDir = './resource/' + current_datetime.getDate() + "-" +(current_datetime.getMonth() + 1) +  "-" + current_datetime.getFullYear()+'.json';
const userDir = './resource/user.json';


module.exports = {
    
    saveInform: function(obj){
        var locationDir;
        if(obj instanceof ActivityModel){
            locationDir = activityDir;
        }else if(obj instanceof UserModel){
            locationDir = userDir;
        }else{
            console.log("Unknow location to save");
        }
        if(fs.existsSync(locationDir)) {                //handle when file is existed
            var data = fs.readFileSync(locationDir);
            var dataArray = JSON.parse(data);
            if(obj.plan != null){                       //update property 'plan' in exist activity
                for(i=0 ; i<dataArray.length ; i++){
                    if(dataArray[i].userId == obj.userId && dataArray[i].location == obj.location){
                        dataArray[i].plan = obj.plan;
                    }
                }
            }else if(obj.plan == null || obj.plan == undefined){        //append activity or user in exist file
                dataArray.push(obj);
            }
            fs.writeFileSync(locationDir,JSON.stringify(dataArray, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
            });
        }else{                      //Create new activity.json or user.json
            var dataArray = [];
            dataArray.push(obj);
            fs.writeFileSync(locationDir,JSON.stringify(dataArray, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
            });
        }
    },

    
    findInform: function(obj){
        var locationDir = eval(obj.select+'Dir');
        if(fs.existsSync(locationDir)){
            var data = fs.readFileSync(locationDir);
            var dataArray = JSON.parse(data);
            var resultArray = [];
            var returnArray = [];
            var count = obj.count;
            if(obj.count == null){
                count = dataArray.length;
            }
            for(i=0 ; i<dataArray.length ; i++){
                if(obj.where.userId !== null){
                    if(dataArray[i].userId == obj.where.userId){
                        resultArray.push(dataArray[i]);
                    }
                }else if(obj.where.userId !== null && obj.where.location !== null){
                    if(dataArray[i].userId == obj.where.userid && dataArray[i].location == obj.where.location){
                        resultArray.push(dataArray[i]);
                    }
                }else if(obj.where.userId !== null && obj.where.location !== null && obj.where.plan !== null){
                    if(dataArray[i].userId == obj.where.userid && dataArray[i].location == obj.where.location 
                    && dataArray[i].plan != null){
                        resultArray.push(dataArray[i]);
                    }
                }
            }
            if(obj.order.desc == true){
                resultArray.reverse();
            }
            for(i = 0 ; i < count ; i++){
                returnArray.push(resultArray[i]);
            }
            return returnArray;

            /*var data = fs.readFileSync(locationDir);
            var dataArray = JSON.parse(data);
            var resultArray = [];

            for(i=0 ; i<dataArray.length ; i++){
                for (var property in obj) {
                    if (obj.hasOwnProperty(property)) {
                        //console.log(typeof obj[property]);
                      
                        if(typeof obj[property] == "object"){
                            //console.log(obj[property]);
                            
                            for(var property1 in obj[property]){
                                if(obj[property].hasOwnProperty(property1)){
                                    console.log(obj[property][property1]);
                                }
                                
                            }
                        }


                        if(dataArray[i][property] == obj[property]){
                        



                        }
        
                    }
            
                }
            }*/
        }else{
            console.log("There is no file");
        }




        /*if(fs.existsSync(locationDir)){
            var data = fs.readFileSync(locationDir);
            var dataArray = JSON.parse(data);
            var resultArray = [];
            var loopCount = 0;
            var wantCount = obj.count;
            if(obj.count == null){
                wantCount = dataArray.length;
            }
            if(obj.order.desc == false){
                for(i=0 ; i<dataArray.length ; i++){
                    if(dataArray[i].userId == obj.where.userid){
                        resultArray.push(dataArray[i]);
                        loopCount++;
                    }
                    if(loopCount >= wantCount){
                        return resultArray;
                    }
                }
            }
            else if(obj.order.desc == true){
                for(i=dataArray.length ; i>0 ; i--){
                    if(dataArray[i-1].userId == obj.where.userid){
                        resultArray.push(dataArray[i-1]);
                        loopCount++;
                    }
                    if(loopCount >= wantCount){
                        return resultArray;
                    }
                }
                return resultArray;
            }
        }else{
            console.log("There is no file");
        }*/
    }
}
