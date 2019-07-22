import { LocalFile as dal } from "../data_access_layer"
import { Activity,User } from "../model"
import * as _ from 'lodash'
import * as fs from "fs"
import isSubset from 'is-subset'

// var testDir = "D:/Data/";
// function clearDir(){
//     fs.rmdirSync(testDir);
// }

var DB = new dal(testDir,[Activity]);
DB.save(new User("LineID1","displayName1"));
DB.save(new Activity("javjavjav"));
DB.find(new User())

// var read_from_json =  {
//     userId : "displayName",
//     name : "0001"
// }

// var to_be_update ={
//     userId : "displayName",
//     name : "0001"
// }

// var update = {
//     name: "0001"
// }

// console.log(isSubset({a:"1",b:"2"},{a:"1"}))
// console.log(isSubset({a:"1"},{a:"1",b:"2"}))
// console.log(isSubset({a:"1",b:"2"},{a:"2",b:"2"}))
// console.log(isSubset({a:"1",b:"2"},{a:"1",b:"2"}))
