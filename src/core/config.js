
const findGroupId = require('./data_access_layer/local_file');

module.exports = {
    
    port: "3000",
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret,
    ReportGroupId: findGroupId.getGroupId()
}