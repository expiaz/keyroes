var Redis = require('./Redis_server');

function isRegistered(id,fn){
    Redis.sscan("users","0","match",id,"count","1",function(err,replies){
        if(err) throw(err);
        fn(replies[1].length == 1);
    });
}

function addUser(user,fn){
    isRegistered(user.id,function(r){
        if(r){
            fn(true,"User already exists");
        }
        else{
            Redis.multi()
                .sadd("users",user.id)
                .hmset("user:"+user.id,user)
                .exec(function(err){
                    if(err) throw(err);
                    fn(false,user);
                });
        }
    });
}

function getUser(id,fn){
    isRegistered(id,function(r){
        if(r){
            fn(true,"User doesn't exists");
        }
        else{
            Redis.hgetall("user:"+id, function (err, res){
                if(err) throw(err);
                else fn(false,res);
            });
        }
    });

}

module.exports.addUser = addUser;
module.exports.getUser = getUser;