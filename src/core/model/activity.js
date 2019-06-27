module.exports = class Activity{
    constructor(id, user, coming, timestamp, location,activityInfo) {
    this.userId = id;
    this.user = user;
    this.type = coming;
    this.timestamp = timestamp;
    this.location = location;
    this.plan = activityInfo;   
    }
}
