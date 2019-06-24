function activity(id, user, coming_in, coming_out, location, timestamp) {
    this.id = id;
    this.user = user;
    this.coming_in = coming_in;
    this.coming_out = coming_out;
    this.location = location
    this.timestamp = timestamp;
}
function getactivityInfo(lineId, displayName) {
    var activityInfo = new activity(lineId, displayName);
    return activityInfo;
}