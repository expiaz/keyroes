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
    ids.forEach(function (id,i) {
        UserModelRedis.addUser(id,function (err,res) {
            if(--stop == 0) return fn(false,"Done adding users");
        });
    });
}

function getUsers(ids,fn){
    var users = [];

    ids.forEach(function (id,i) {
        UserModelRedis.getUser(id,function (err,user) {
            users.push(user);
            if(users.length == ids.length) return fn(false,users);
        });
    });
}

function setUsers(ids,props,fn){
    var stop = ids.length;
    ids.forEach(function (id,i) {
        UserModelRedis.setUser(id,props,function (err,res) {
            if(--stop == 0) return fn(false,"Done setting users");
        });
    });
}

function delUsers(ids,fn){
    var stop = ids.length;
    ids.forEach(function (id,i) {
        UserModelRedis.delUser(id,function (err,res) {
            if(--stop == 0) return fn(false,"Done deleting users");
        });
    });
}


