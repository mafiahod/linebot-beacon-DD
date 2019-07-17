import * as elasticsearch from 'elasticsearch'
import { logger } from '../../../logs/logger';
const current_datetime = new Date();
var client = new elasticsearch.Client({
    host: 'localhost:9200',
     log: 'trace'
});
// var thescript ={
//     "inline" :`ctx._source.plan='${obj.plan}';`
// }

async function elastic_update(obj,property) {
    console.log("-------------------------------------")
    console.log(obj[property]);
   // console.log(obj);
   //let a = obj[property];
   await  client.updateByQuery({
        index: 'myindex',//+current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear(),
        type: '_doc',
        body: {          
            "query": { "match": { "obj.userId": obj.userId} },            
            "script": { "inline": `ctx._source.obj.${property}='${obj[property]}';` }
        }      
    }, (result) => {
        logger.info("elasticupdate");
        logger.error(result);
    });

}


async function elastic_save(obj) {
    await client.index({
        index: 'myindex',//+current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear(),
        type: '_doc',
        body: {
            obj
        }
    }, (result) => {
        logger.info("elasticsave");
        logger.error(result);

    });
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