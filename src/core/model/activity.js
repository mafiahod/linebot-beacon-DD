"use strict";
export class Activity{
    constructor(id,user,coming,timestamp,location,askstate,activityInfo,url,lat_long) {
    this.userId = id;
    this.name = user;
    this.type = coming;
    this.timestamp = timestamp;
    this.location = location;
    this.askstate = askstate;  
    this.plan = activityInfo;  
    this.url = url; 
    this.lat_long=lat_long;
    }
}

