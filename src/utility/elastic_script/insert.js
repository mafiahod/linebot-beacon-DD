import { Client as ESClient} from 'elasticsearch';
import { Activity, User ,Location} from "../../core/model/index";
import { isUndefined } from 'util';

import { logger } from '../../logger';
import { ElasticService } from '../../core/service/elastic_service';
const elastic = new ElasticService();

let allUsers = [new User('5988077','Ball'), new User('5988079', 'JA'),new User('5988034', 'JAM'), new User('5688016','Dutch')];
allUsers[0].url = "https://profile.line-scdn.net/0h0UEumszrb3p4DEBwoiYQLURJYRcPImkyAG4lGggIOE5XOXt-QT50FFRYMB0Ba3h-FGkgFA9cOE1X";
allUsers[1].url = "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e";
allUsers[2].url = "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e";
allUsers[3].url = "https://profile.line-scdn.net/0h0UEumszrb3p4DEBwoiYQLURJYRcPImkyAG4lGggIOE5XOXt-QT50FFRYMB0Ba3h-FGkgFA9cOE1X";
let allMessages = ['no plan','working','sleeping','have lunch','debugging'];
let allLocations = ['Ais','DDTH','BBL','KK','SiamPiwat'];

let client = new ESClient({host:'localhost:9200',log:'info'});

function createRandomActivity(date,pickedUser){

    //let pickedUser = allUsers[Math.round(Math.random()*4)];
    let randomMessageIndex = Math.round(Math.random()*4);
    let pickedMessage = allMessages[randomMessageIndex];
    let pickedLocation = allLocations[Math.round(Math.random()*5)];
    let randomHour = Math.round(Math.random()*60*60*1000*3); // random in 3 hour range
   // let currentDate = new Date().getTime();
    date.setTime(randomHour+date.getTime());
    if(isUndefined(pickedMessage)) console.log(randomMessageIndex);
    return new Activity(pickedUser.userId,pickedUser.name,'in',date.getTime(),new Location("asdfasdf",pickedLocation,{lat:23,lon:33}),true,pickedMessage,pickedUser.url);
}

async function insertRandomIndex(date,month,year,user){
    let gp7Date = new Date(year,month-1,date,7);
    let ranAct  = createRandomActivity(gp7Date,user); 
    elastic.save(ranAct);
}


for(let j = 1;j<2;j++){
    for(let i =0;i<1;i++){
        insertRandomIndex(1,2,2017,allUsers[i]).catch((err)=>{console.log(err);});
    }
}

 
