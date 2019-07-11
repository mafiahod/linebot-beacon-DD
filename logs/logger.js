const log4js = require('log4js');
const current_datetime = new Date();
var Log_config = log4js.configure({
  
    appenders: {
      app: {
        type: "file",
        filename: "./logs/"+ current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()+ " app.log" ,       
        maxLogSize: 10485760,
        numBackups: 3
      
      },
    categories: {
     default: { "appenders": ["app"], "level": "DEBUG" }
     
    }

  }
});

const logger = log4js.getLogger('');

export {
  logger,Log_config
}