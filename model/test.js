
const user = require('./user.js');
const profile = require();
function getuserInfo(lineId, displayName) {
    var userInfo = new user(profile.userId, profile.displayName);
    return userInfo;
}

console.log(getuserInfo('123', 'jam').lineId);

