import {Client as ESClient} from 'elasticsearch';
import { Activity, User } from "../../core/model";

let allUsers = [new User('5988077','Ball'), new User('5988079', 'JA'),new User('5988034', 'JAM'), new User('5688016','Dutch')];
let allMessages = ['no plan','working','sleeping','have lunch'];
let allLocations = ['Ais','DDTH','BBL','KK','SiamPiwat']

let client = new ESClient({host:'localhost:9200'});

function createRandomActivity(date,pickedUser){

    //let pickedUser = allUsers[Math.round(Math.random()*4)];
    let pickedMessage = allMessages[Math.round(Math.random()*4)];
    let pickedLocation = allLocations[Math.round(Math.random()*5)];
    let randomHour = Math.round(Math.random()*60*60*1000*3); // random in 3 hour range
    date.setTime(randomHour+date.getTime());


    return new Activity(pickedUser.userId,pickedUser.name,'in',date.getTime(),pickedLocation,true,pickedMessage);
}



function insertRandomIndex(date,month,year,user){
    let gp7Date = new Date(year,month-1,date,7);
    let ranAct  = createRandomActivity(gp7Date,user);
    let indexStr = `activity-${gp7Date.getDate()}-${gp7Date.getMonth()+1}-${gp7Date.getFullYear()}`
    client.indices.create({
        index: indexStr,
        body: {
            mappings:{
                "properties": {
                    "timestamp": {
                    "type": "date"
                    }
                }
            }
        }
        
    }).then(suc=>console.log(suc)).catch(err=>{console.log(err)});

    client.index({
        index: indexStr,
        type: '_doc',
        refresh: true,
        body: ranAct
        
    }).then(suc=>console.log(suc)).catch(err=>{console.log(err)});
}
for(let j = 1;j<22;j++){
    for(let i =0;i<allUsers.length;i++){
        insertRandomIndex(j,7,2019,allUsers[i]);
    }
}
