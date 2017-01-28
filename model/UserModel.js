var redis = require('./redis/server');
var userClass = require('./../class/User');
var Q = require('q');

var db = {
    sadd: Q.nbind(redis.sadd,redis),
    smembers : Q.nbind(redis.smembers,redis),
    srem: Q.nbind(redis.smembers,redis),
    sscan: Q.nbind(redis.sscan,redis)
}

class UserModel{
    constructor(){}

    CheckUsername(username){
        return db.sscan("usernames","0","match",username,"count","999")
            .then(function (res) {
                return 1
            });
    }



    Register(sid,username){
        var user = new userClass(sid,username);

    }

}