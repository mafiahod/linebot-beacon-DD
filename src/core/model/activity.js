module.exports =  class Activity{
    constructor(id,user,coming,timestamp,location,askstate,activityInfo) {
    this.userId = id;
    this.name = user;
    this.type = coming;
    this.timestamp = timestamp;
    this.location = location;
    this.askstate = askstate; 
    this.plan = activityInfo;   
    }
}
