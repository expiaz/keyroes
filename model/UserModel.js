'use strict';
var manager = require('./../manager/UserManager');
var sql = require('mysql');



class UserModel{
    constructor(){}

    queryGenerator(fields,value){
        return 'SELECT '+ (fields ? Array.isArray(fields) ? fields.join(',') : fields : '*') +' FROM USER ' + (value ? Array.isArray(value) ?  'WHERE '+ value.map(function(exp){ return Array.isArray(exp) ? exp.join(' ') : exp }).join(' AND ') : 'WHERE '+ value : ';');
    }

    getUser(fields){
        if(!fields)
        var sql = 'SELECT * FROM USER',
            f = [],
            v = [];

        for(var field in fields){
            f.push(field);
            v.push(fields[field]);
        }
    }

}