(function () {'use strict';}());
export class Activity{
    constructor(id,user,coming,timestamp,location,askstate,plan,url) {
        this.userId = id;
        this.name = user;
        this.type = coming;
        this.timestamp = timestamp;
        this.location = location;
        this.askstate = askstate;  
        this.plan = plan;  
        this.url = url;
    }
}

