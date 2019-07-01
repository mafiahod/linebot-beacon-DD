const activitymodel = require('./activity');
const statemodel = require('./state');
const usermodel = require('./user');

exports.activity  =activitymodel.Activity();
exports.state  =statemodel.State();
exports.user  =usermodel.Userinfo();


