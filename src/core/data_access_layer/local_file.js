"use strict";
import { User, Activity } from '../model/index'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import { logger } from '../../../logs/logger';
import isIncludeMatchedProperties from 'is-subset'

const current_datetime = new Date();
const defDir = './resource/DB/';


function isClass(obj){
    return obj.constructor.name === 'Function';
}

function getClassName(obj){
    if(isClass(obj)) return obj.name;
    else return obj.constructor.name;
}

function extractNotNull(in_obj) { // remove null and undefined property
    let obj = _.clone(in_obj)
    for (var propName in obj) { 
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
}

class LocalFile {
    
    constructor(inputDbDir = defDir, transactionalClass=[]) {
        this.dbDir = inputDbDir;
        let tran = [];
        for(var i =0;i< transactionalClass.length;i++){
            tran.push(getClassName(transactionalClass[i]));
        }
        this.transactionalClass = tran;
    }

    save(obj) {   //ต้องเป็น Object ที่ได้มาจากการ new Object จาก Model เท่านั้น
        var fileUrl = this.getSaveFilePath(obj);
        var dataArray = [];
        if(!fs.existsSync(this.getSaveDir(obj))) fs.mkdirSync(this.getSaveDir(obj),{recursive:true})
        if(fs.existsSync(fileUrl)) dataArray = JSON.parse(fs.readFileSync(fileUrl));
        //append activity or user in exist file
        dataArray.push(obj);
        fs.writeFileSync(fileUrl, JSON.stringify(dataArray, null, 4),{flag:'w'});
        logger.debug(`save success: ${obj}`);
    }
    
      
    // updateValue เป็น object ที่ต้องการหาโดย new มาจาก Model , replace ถ้าใส่ค่า true จะทำการทับข้อมูลเก่าด้วย obj (paramiter แรก)
    update(updateValue, replace=false, findObj) {    
        var fileUrl = this.getSaveFilePath(findObj)
        if (!fs.existsSync(fileUrl)) return logger.info("There is no file to update");
        var dataArray = this.getObjFileContent(findObj);
        findObj = extractNotNull(findObj);
        var cleanUpdateValue = extractNotNull(updateValue)
        var updateCount =0;
        for (var i =0; i<dataArray.length; i++) {
            var curData = Object.assign(new findObj.constructor(),dataArray[i]);
            if(isIncludeMatchedProperties(curData,findObj)){
                let toUpdate;
                if (!replace) 
                    toUpdate = Object.assign(curData,cleanUpdateValue);
                else 
                    toUpdate = updateValue;
                logger.debug(`mark for update: ${dataArray[i]} to ${toUpdate}`);
                dataArray[i] = toUpdate;
                updateCount++;
            }
        }
        fs.writeFileSync(fileUrl, JSON.stringify(dataArray, null, 4));
        logger.debug(`update <value=${updateValue} replace=${replace}> success total: ${updateCount} records`);
    }
    
    find(findObj, count, desc=false) { 
        // DESC is how to sort data desc is descending new data come first else is ASC which is old data come first
        //desc เป็น property ที่ใช้เรียงตาม เวลา เก่าไปใหม่ หรือ ใหม่ไปเก่า เท่านั้น
        var fileUrl = this.getSaveFilePath(findObj);
        if (!fs.existsSync(fileUrl)) return [];
        var dataArray = this.getObjFileContent(findObj);
        if(desc)  dataArray.reverse();
        var resultArray = [];
        findObj = extractNotNull(findObj)
        for (var i =0; i<dataArray.length; i++) {
            if(count != null && resultArray.length+1>count) break;
            var curData = Object.assign(new findObj.constructor(),dataArray[i]);
            if(isIncludeMatchedProperties(curData,findObj)){
                resultArray.push(curData);
            }
        }
        return resultArray;
    }

    isTransactional(obj){
        return this.transactionalClass.includes(getClassName(obj));
    }

    getSaveFilePath(obj){ // ควรเป้น private method
        return path.join(this.getSaveDir(obj),getClassName(obj)+".json");
    }

    getSaveDir(obj){
        if(this.isTransactional(obj))
            var folder = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear();
        else
            var folder = 'master';
        return path.join(this.dbDir,folder);
    }

    getObjFileContent (obj) {
        return JSON.parse(fs.readFileSync(this.getSaveFilePath(obj)));
    }
}

export { LocalFile }