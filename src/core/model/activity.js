module.exports = class activityInfo{
    constructor(id, user, coming_in, timestamp, location) {
    this.userId = id;
    this.user = user;
    this.coming_in = coming_in;
    //this.coming_out = coming_out;
    this.timestamp = timestamp;
    this.location = location

    }
}
