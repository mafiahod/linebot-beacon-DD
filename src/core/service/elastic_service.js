import * as elasticsearch from 'elasticsearch'

var client = new elasticsearch.Client({
  host: 'localhost:9200',
 // log: 'trace'
});
async function elastic_post(obj){
await client.index({
    index: 'myindex',
    type: '_doc',
    body: obj
  });
}

export {
    elastic_post
}