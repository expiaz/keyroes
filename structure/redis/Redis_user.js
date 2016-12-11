var Redis = require('./Redis_server');

function isRegistered(id,fn){
    Redis.get("user:"+id,function(err,res){
        if(err) throw(err);
        fn(res ? true : false );
    });
}

function setUser(user,fn){
    isRegistered(user.id,function(r){
        if(r){
            fn(true,"User already exists");
        }
        else{
            Redis.multi()
                .sadd("users",user.id)
                .hmset("user:"+user.id,user)
                .exec(function(err){
                    if(err) fn(true,"Problem adding user "+user.id);
                    else fn(false,user);
                });
        }
    });
}

function getUser(id,fn){
    isRegistered(id,function(r){
        fn(true,"User doesn't exists");
        return;
    });
    Redis.hgetall("user:"+id, function (err, res){
        if(err) fn(true,"Problem retrieving user hset");
        else fn(false,res);
    });
}

module.exports.setUser = setUser;
module.exports.getUser = getUser;