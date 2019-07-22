import { Activity } from '../model/'
import moment from 'moment'
import elasticsearch from 'elasticsearch'

const proto = new Activity();
const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});


// new Date()
// var a = n.getTime();

// console.log(n);
// console.log(a);
// console.log(moment(a).format('DD-MM-YYYY'));

// console.log(Math.random());
// console.log(moment(1559350861000 + Math.random() * (1561856461000 - 1559350861000)).format('DD-MM-YYYY'));

for (var i = 1; i < 31; i++) {




    for (var b = 1; b <= (Math.random()+0.1) * 10; b++) {
        var a =  (86400 * i) + 1559350861;
        proto.timestamp = a;

        client.index({
            index: `activity-${i}-06-2019`,
            refresh: true,
            type: '_doc',
            body: proto
        });

    }



}





// proto.name = "Balllll";

// //console.log(proto);