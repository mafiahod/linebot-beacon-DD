module.exports = class Condition{
    constructor(objtype,value_where,loc,actI,number,type)
    {
        this.select = objtype;
        this.where = {
            'userId': value_where,
            'location' : loc,
            'plan' : actI
        };
        this.count = number;
        this.order = {
            'desc' : type
        };
        
    }
}