var Redis = require('./Redis');
var User = require('./User');

module.exports.Register = Register;
module.exports.addQueue = addQueue;

function Register(id,username,fn){
    var user = new User(id,username);
    Redis.Users.addUser(user,function(e,r){
        if(e) fn(e,r);
        else fn(e,user);
    });
}

function addQueue(id,fn){
    Redis.Game.addQueue(id,function(e,r,trigger,players){
        if(e) fn(e,r);
        else fn(e,r,trigger,players);
    });
}


