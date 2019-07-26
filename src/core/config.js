(function () {'use strict';}());


module.exports = {
    port : '3000' ,
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret,
    ReportGroupId: "C1480c3589301043727019de4eebc799b",
    AnswerAlertDuration: 5000, //ms,
    ElasticConfig:{
        host: 'localhost:9200',
        log: "info"
    } 
};



 