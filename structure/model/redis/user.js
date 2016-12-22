var Redis = require('./server');


var User = {
    addUser: addUser,
    getUser: getUser,
    delUser: delUser,
    setUser: setUser
}

module.exports = User;

function isRegistered(id,fn){
    Redis.sscan("users","0","match",id,"count","999",function(err,replies){
        if(err) throw new Error(err);
        fn(replies[1].length == 1);
    });
}

function addUser(user,fn){
    isRegistered(user.id,function(r){
        if(r) return fn(true,"User already exists");
        Redis.multi()
            .sadd("users",user.id)
            .hmset("user:"+user.id,user)
            .exec(function(err){
                if(err) throw new Error(err);
                fn(false);
            });
    });
}

function getUser(id,fn){
    isRegistered(id,function(r){
        if(!r) return fn(true,"[Model:user:getUser] User doesn't exists");
        Redis.hgetall("user:"+id, function (err,fetch_user){
            if(err) throw new Error(err);
            fn(false,fetch_user);
        });
    });
}

function delUser(id,fn){
    isRegistered(id,function(r){
        if(!r) return fn(true,"[Model:user:delUser] User doesn't exists");
        Redis.srem("users",id,function(err,res){
            if(err) throw(err);
            Redis.del("user:"+id,function(err,res){
                if(err) throw new Error(err);
                fn(false);
            });
        });
    });
}

function setUser(id,props,fn){
    isRegistered(id,function(r){
        if(!r) return fn(true,"[Model:user:setUser] User doesn't exists");
        Redis.hmset("user:"+id,props,function (err,res) {
            if(err) throw new Error(err);
            fn(false);
        });
    });
}