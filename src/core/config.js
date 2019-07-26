(function () {'use strict';}());


module.exports = {
    port : '3000' ,
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret,
    ReportGroupId: "C6ce76af8d6b199b60bb675b85e8cea2f",
    AnswerAlertDuration: 5000, //ms,
    ElasticConfig:{
        host: 'localhost:9200',
        log: "info"
    } 
};



 