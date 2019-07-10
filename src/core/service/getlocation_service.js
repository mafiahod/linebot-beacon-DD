"use strict";
import * as fs from 'fs'
const locationDir = './resource/location.json';

function getLocation(hwid) {
    if (fs.existsSync(locationDir)) {
        var data = fs.readFileSync(locationDir);
        var dataArray = JSON.parse(data);
        for (var i in dataArray) {
            if (dataArray[i].hardwareID == hwid) {
                return dataArray[i].LocationName;
            }
        }

    } else {
        console.log("No Location File");
    }
}


class GetLocation_service{
    constructor(){
        this.getLocation = getLocation;
    }
}

export { GetLocation_service }