import elasticsearch from 'elasticsearch';
import config from  '../config';
import { Activity , User} from '../model';
import { logger } from '../../logger';

const current_datetime = new Date();
const activityMapping = {
    "properties": {
        "timestamp": {
        "type": "date"
        },
        "location":{
            "properties":{
                "point":{
                    "type":"geo_point"
                }
            }
        }
    }
};

const client = new elasticsearch.Client(config.ElasticConfig);


async function insertActivity(activity){
    let gp7Date = new Date(activity.timestamp);
    let indexStr = `activity-${gp7Date.getDate()}-${gp7Date.getMonth()+1}-${gp7Date.getFullYear()}`;
    try{
        if(!await client.indices.exists({index: indexStr})){
            await client.indices.create({index: indexStr,body: {mappings:activityMapping}});
            logger.info(`create index: [${indexStr}] success`);
        }
        else{ logger.info(`create index: [${indexStr}] already exist`); }

        await client.index({
            index: indexStr,
            type: '_doc',
            refresh: true,
            body: activity
        });
    }catch(err){console.log("cannot insert activity: ",err);}
}


function elastic_update(obj , target) {
    var presentIndex;
    if (obj instanceof Activity) {
        presentIndex = 'activity-'+current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear();
    } else if (obj instanceof User) {
        presentIndex = "user";
    }
    console.log("Enter Query");
    var queryArray = [];
    for(var property in obj){
        console.log(property);
        if(obj[property] != null && property != target){
            queryArray.push({match : { [property] : obj[property] }});
        }
    }
    var scriptSet = {"inline": `ctx._source.${target} = '${obj[target]}'; `};
    if(obj[target] == true || obj[target] == false) scriptSet = {"inline": `ctx._source.${target} = ${obj[target]}; `};
    
    console.log(queryArray);
    var promise = new Promise((resolve, reject) => {
        
        var res = client.updateByQuery({
            index: presentIndex,
            refresh : true,
            type: '_doc',
            body: {
                "query": {
                    "bool": {
                      "must": queryArray
                    }
                  },
                "script": scriptSet
            }
        })
        
        // console.log("-----------------------------------------");
        // console.log("res string", JSON.stringify(res)); // {}
        // console.log("res object", res); // {}
        resolve(res);
        reject();
        // res.then(() => {
        //     console.log("resolve")
        //     resolve(res);
        // })
        // .catch(() => {
        //     console.log("reject")
        //     reject();
        // })
        
        
    });

    // promise.then((data) => {
    //     console.log("data", data)
    // })
    // .catch((err) => {
    //     console.log("err", err)
    // })
    return promise;
}



class ElasticService {
    constructor() {
        this.save = insertActivity;
        //this.update = elastic_update;

    }
}


export {
    ElasticService
};