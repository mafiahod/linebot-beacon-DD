const profile = require();
function user(lineId, displayName) {
        this.lineId = lineId;
        this.displayName = displayName;
   
}

function getuserInfo(lineId, displayName) {
    var userInfo = new user(lineId, displayName);
    return userInfo;
}

//getuserInfo(profile.lineId,profile.displayName);