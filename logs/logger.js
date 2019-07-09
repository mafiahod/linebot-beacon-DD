const log4js = require('log4js');
const current_datetime = new Date();
var Log_config = log4js.configure({
  
    appenders: {
      app: {
        type: "file",
        filename: "./log/"+ current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()+ " info.log" ,       
        maxLogSize: 10485760,
        numBackups: 3
      },
      errorFile: {
        type: "file",
        filename: "./log/"+ current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()+ " error.log" 
      },
      errors: {
        type: "logLevelFilter",
        level: "ERROR",
        appender: "errorFile"
      }
    },
    categories: {
      default: { "appenders": [ "app","errors" ], "level": "DEBUG" },

     
    }

 
});

const logger = log4js.getLogger('test');

export {
  logger,Log_config
}