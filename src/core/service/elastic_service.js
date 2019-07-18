import * as elasticsearch from 'elasticsearch'
import {Activity , User} from '../model/index'
import { doesNotThrow } from 'assert';
import { logger } from '../../../logs/logger';

const current_datetime = new Date();

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    //log: 'trace'
});


function elastic_save(obj) {
    console.log("Enter function");
    var presentIndex;
    if (obj instanceof Activity) {
        presentIndex = 'activity-'+current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear();
    } else if (obj instanceof User) {
        presentIndex = 'user';
    }
    var promise = new Promise((resolve, reject) => {
        var res = client.index({
            index: presentIndex,
            type: '_doc',
            body: obj
        });
        resolve(res);
        reject();
    });
    return promise;
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
    console.log(queryArray);
    var promise = new Promise((resolve, reject) => {
        var res = client.updateByQuery({
            index: presentIndex,
            type: '_doc',
            body: {
                "query": {
                    "bool": {
                      "must": queryArray
                    }
                  },
                "script": { "inline": `ctx._source.${target} = ${obj[target]}; ` }
            }
        });
        resolve(res);
        reject();
    });
    return promise;
}



class Elastic_service {
    constructor() {
        this.elasticsave = elastic_save;
        this.elasticupdate = elastic_update;

    }
}


export {
    Elastic_service
}