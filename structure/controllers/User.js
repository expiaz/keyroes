var UserModelRedis = require('./../model/redis/user');
var UserModelSql = require('./../model/sql/user');

var User = {
    Model:{
        Redis: UserModelRedis,
        Sql: UserModelSql
    },
    addUsers: addUsers,
    getUsers:getUsers,
    setUsers: setUsers,
    delUsers: delUsers
};

module.exports = User;

function addUsers(ids,fn){
    var stop = ids.length;
    ids.forEach(function (id) {
        UserModelRedis.addUser(id,function (err,res) {
            if(err) return fn(true,res);
            if(--stop == 0) return fn(false);
        });
    });
}

function getUsers(ids,fn){
    var users = [];

    ids.forEach(function (id) {
        UserModelRedis.getUser(id,function (err,user) {
            if(err) return fn(true,user);
            users.push(user);
            if(users.length == ids.length) return fn(false,users);
        });
    });
}

function setUsers(ids,props,fn){
    var stop = ids.length;
    ids.forEach(function (id) {
        UserModelRedis.setUser(id,props,function (err,res) {
            if(err) return fn(true,res);
            if(--stop == 0) return fn(false);
        });
    });
}

function delUsers(ids,fn){
    var stop = ids.length;
    ids.forEach(function (id) {
        UserModelRedis.delUser(id,function (err,res) {
            if(err) return fn(true,res);
            if(--stop == 0) return fn(false);
        });
    });
}


