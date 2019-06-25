const fs = require("fs");
const current_datetime = new Date();
const activityDir = './resource/' + current_datetime.getDate() + "-" +(current_datetime.getMonth() + 1) +  "-" + current_datetime.getFullYear()+'.json';
const userDir = './resource/user.json';
const groupIdDir = './resource/groupId.json';


module.exports = {
    saveActivity: function (event,profile) {
        //append data to exist file : Activity
        if (fs.existsSync(activityDir)) {
            var appendActivity = {
                userId: event.source.userId,
                user: profile.displayName,
                timestamp: event.timestamp,
                time: current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds(),
                location: "Dimension Data Office, Asok"
            }
            var data = fs.readFileSync(activityDir);
            var dataObj = JSON.parse(data);
            dataObj['activity'].push(appendActivity);
            fs.writeFileSync(activityDir,JSON.stringify(dataObj, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
            });
        }else{
            //create new file : Activity
            var activityObject = {
                activity : [{
                    userId: event.source.userId,
                    user: profile.displayName,
                    timestamp: event.timestamp,
                    time: current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds(),
                    location: "Dimension Data Office, Asok"
                }]
            }
            fs.writeFileSync(activityDir,JSON.stringify(activityObject, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
            });
        }

        
    },


    saveUser: function(event,profile){
        console.log('show : ' + event.joined.members[0].userId);
        //append data to exist file : User
        if (fs.existsSync(userDir)) {
            var count = 0;
            var data = fs.readFileSync(userDir);
            var dataObj = JSON.parse(data);
            for(i = 0 ; i < dataObj.user.length ;i++){
                if(dataObj.user[i].userId == event.joined.members[0].userId){
                    count++;
                }
            }
            if(count == 0){
                var appendUser = {
                    userID: event.joined.members[0].userId,
                    name: profile.displayName
                }
                dataObj['user'].push(appendUser);
                fs.writeFileSync(userDir,JSON.stringify(dataObj, null, 4), (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    };
                });
            }
        }else{
            //create new file : User
            var userObject = {
                user : [{
                    userId: event.source.userId,
                    name: profile.displayName
                }]
            }
            fs.writeFileSync(userDir,JSON.stringify(userObject, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
            });
        }
    },



    

    findInform: function (a) {
        if(a===undefined){
            var allData = {
                'user' :[],
                'activity': []
            };
    
            if (fs.existsSync(userDir)) {
                var userData = fs.readFileSync(userDir);
                var userDataObj = JSON.parse(userData);
                allData['user'] = userDataObj['user'];

            }else{console.log("There is no User file");}


            if (fs.existsSync(activityDir)) {
                var activityData = fs.readFileSync(activityDir);
                var activityDataObj = JSON.parse(activityData);
                allData['activity'] = activityDataObj['activity'];

            }else{console.log("There is no Acitivity file");}

            console.log(allData);
        }


        
        else if(a === 'user'){
            var allData = [];
            if (fs.existsSync(userDir)) {
                var userData = fs.readFileSync(userDir);
                var userDataObj = JSON.parse(userData);
                allData = userDataObj['user'];
                console.log(allData);

            }else{console.log("There is no User file");}
        }



        else if(a === 'activity'){
            var allData = [];
            if (fs.existsSync(activityDir)) {
                var activityData = fs.readFileSync(activityDir);
                var activityDataObj = JSON.parse(activityData);
                allData = activityDataObj['activity'];
                console.log(allData);

            }else{console.log("There is no Activity file");}
        }
    },



    saveGroupId: function (event){
        var groupId = event.source.groupId;
        var groupIdObject = {
            groupId : groupId
        }
        fs.writeFileSync(groupIdDir,JSON.stringify(groupIdObject, null, 4), (err) => {
            if (err) {
                console.error(err);
                return;
            };
        });
    },

    getGroupId: function (){
        if(fs.existsSync(groupIdDir)){
            var groupId = fs.readFileSync(groupIdDir);
            var groupIdObj = JSON.parse(groupId);
            
            console.log(groupIdObj['groupId']);
            return groupIdObj['groupId'];
        }
    }


}
