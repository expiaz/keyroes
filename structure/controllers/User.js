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
    var ack = false;
    ids.forEach(function (id,i) {
        UserModelRedis.addUser(id,function (err,res) {
            ack == ack && (err?true:false);
        });
    });
    if(ack) fn(true,"Fail adding users");
    else fn(false,"Done adding users");
}

function getUsers(ids,fn){
    var ack = false,
        users = [];

    ids.forEach(function (id,i) {
        UserModelRedis.getUser(id,function (err,user) {
            ack == ack && (err?true:false);
            users.push(user);
        });
    });
    if(ack) fn(true,"Fail getting users");
    else fn(false,users);
}

function setUsers(ids,props,fn){
    var ack = false;
    ids.forEach(function (id,i) {
        UserModelRedis.setUser(id,props,function (err,res) {
            ack == ack && (err?true:false);
        });
    });
    if(ack) fn(true,"Fail settings users");
    else fn(false,"Done setting users");
}

function delUsers(ids,fn){
    var ack = false;
    ids.forEach(function (id,i) {
        UserModelRedis.delUser(id,function (err,res) {
            ack == ack && (err?true:false);
        });
    });
    if(ack) fn(true,"Fail deleting users");
    else fn(false,"Done deleting users");
}


