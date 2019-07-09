const log4js = require('log4js');
var Log_config = log4js.configure({
  
    appenders: {
      access: {
        type: "dateFile",
        filename: "log/access.log",
        pattern: "-yyyy-MM-dd",
        category: "http"
      },
      app: {
        type: "file",
        filename: "log/test1.log",
        maxLogSize: 10485760,
        numBackups: 3
      },
      errorFile: {
        type: "file",
        filename: "log/errors.log"
      },
      errors: {
        type: "logLevelFilter",
        level: "ERROR",
        appender: "errorFile"
      }
    },
    categories: {
      default: { "appenders": [ "app", "errors" ], "level": "DEBUG" },
      http: { "appenders": [ "access"], "level": "DEBUG" }
    }

 
});

const logger = log4js.getLogger('test');

export {
  logger,Log_config
}