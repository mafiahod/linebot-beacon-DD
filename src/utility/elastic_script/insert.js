import { Client as ESClient } from 'elasticsearch';
import { Activity, User } from "../../core/model/index";


let allUsers = [new User('5988077', 'Ball'), new User('5988079', 'JA'), new User('5988034', 'JAM'), new User('5688016', 'Dutch'),new User('5688088', 'Boss'),new User('5688045', 'Kie'),new User('5688099', 'Tee'),new User('5688019', 'Top'),new User('5688027', 'Aek'),new User('5688034', 'Som')];
allUsers[0].url = "https://profile.line-scdn.net/0h0UEumszrb3p4DEBwoiYQLURJYRcPImkyAG4lGggIOE5XOXt-QT50FFRYMB0Ba3h-FGkgFA9cOE1X";
allUsers[1].url = "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e";
allUsers[2].url = "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e";
allUsers[3].url = "https://profile.line-scdn.net/0h0UEumszrb3p4DEBwoiYQLURJYRcPImkyAG4lGggIOE5XOXt-QT50FFRYMB0Ba3h-FGkgFA9cOE1X";
allUsers[4].url = "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e";
allUsers[5].url = "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e";
allUsers[6].url = "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e";
allUsers[7].url = "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e";
allUsers[8].url = "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e";
allUsers[9].url = "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e";
let allMessages = ['no plan', 'working', 'sleeping', 'have lunch'];
let allLocations = ['Ais', 'DDTH', 'BBL', 'KK', 'SiamPiwat']

let client = new ESClient({ host: 'localhost:9200', log: 'trace' });

function createRandomActivity(date) {

    let pickedUser = allUsers[Math.round(Math.random()*10)];
    let pickedMessage = allMessages[Math.round(Math.random() * 4)];
    let pickedLocation = allLocations[Math.round(Math.random() * 5)];
    let randomHour = Math.round(Math.random() * 60 * 60 * 1000 * 3); // random in 3 hour range
    // let currentDate = new Date().getTime();
    date.setTime(randomHour + date.getTime());


    return new Activity(pickedUser.userId, pickedUser.name, 'in', date.getTime(), pickedLocation, true, pickedMessage, pickedUser.url, "13.733014, 100.560290");
}



async function insertRandomIndex(date, month, year) {
    let gp7Date = new Date(year, month - 1, date, 7);
    if(Math.random()<0.9){
    let ranAct = createRandomActivity(gp7Date);
    let indexStr = `activity-${gp7Date.getDate()}-${gp7Date.getMonth() + 1}-${gp7Date.getFullYear()}`
    await client.indices.create({
        index: indexStr,
        body: {
            mappings: {
                "properties": {
                    "timestamp": {
                        "type": "date"
                    },
                    "lat_long": {
                        "type": "geo_point"
                    }
                }
            }
        }

    }).then(suc => console.log(suc)).catch(err => { console.log(err) });

    await client.index({
        index: indexStr,
        type: '_doc',
        refresh: true,
        body: ranAct

    }).then(suc => console.log(suc)).catch(err => { console.log(err) });
}
}

for (let j = 1; j < 23; j++) {
    for (let i = 0; i < allUsers.length; i++) {
        insertRandomIndex(j, 7, 2019);
    }
}


