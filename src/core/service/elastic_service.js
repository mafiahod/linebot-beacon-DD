import * as elasticsearch from 'elasticsearch'
import { doesNotThrow } from 'assert';
import { logger } from '../../../logs/logger';

var client = new elasticsearch.Client({
  host: 'localhost:9200',
 // log: 'trace'
});
// var thescript ={
//     "inline" :`ctx._source.plan='${obj.plan}';`
// }
async function elastic_update(obj){
    console.log("IN EUPDATEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
await client.updateByQuery({
    index: 'myindex',
    type: '_doc',
    body: {
        "query" : {"match" : {"userId" : obj.userId}},
        "script" : {"inline" :`ctx._source.askstate='${obj.askstate}';  `}
    }
    }, (err) => { 
         
        logger.error(err);
        
    }
)}
async function elastic_save(obj){
    console.log("IN ESAVEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    await client.index({
        index: 'myindex',
        type: '_doc',
        body: {
            obj
        }
        }, (err) => { 
             
            logger.error(err);
            
        }
    )}
  
  class Elastic_service {
      constructor(){
          this.elasticsave = elastic_save;
          this.elasticupdate = elastic_update;
          
      }
  }


export {
    Elastic_service
}