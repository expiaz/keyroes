var Redis = require('./server');


var User = {
    addUser: addUser,
    getUser: getUser,
    delUser: delUser,
    setUsername: setUsername,
    setMatch: setMatch,
    setState: setState,
    setUser: setUser
}

module.exports = User;

function isRegistered(id,fn){
    Redis.sscan("users","0","match",id,"count","999",function(err,replies){
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
                    fn(false);
                });
        }
    });
}

function getUser(id,fn){
    isRegistered(id,function(r){
        if(r){
            Redis.hgetall("user:"+id, function (err, res){
                if(err) throw(err);
                fn(false,res);
            });
        }
        else fn(true,"User doesn't exists");
    });
}

function delUser(id,fn){
    isRegistered(id,function(r){
        if(r){
            Redis.srem("users",id,function(err,res){
                if(err) throw(err);
                Redis.del("user:"+id,function(err,res){
                    if(err) throw(err);
                    fn(res?false:true);
                });
            });
        }
        else fn(true,"User doesn't exists");
    });
}

function setUser(id,props,fn){
    isRegistered(id,function(r){
        if(r){
            Redis.hmset("user:"+id,props,function (err,res) {
                if(err) throw(err);
                fn(res?false:true,"User modified");
            })
        }
        else fn(true,"User doesn't exists");
    });
}

function setUsername(id,newsername,fn){
    isRegistered(id,function(r){
        if(r){
            Redis.hset("user:"+id,"username",newsername,function (err,res) {
                if(err) throw(err);
                fn(res?false:true);
            })
        }
        else fn(true,"User doesn't exists");
    });
}

function setMatch(id,match,fn){
    isRegistered(id,function(r){
        if(r){
            Redis.hset("user:"+id,"match",match,function (err,res) {
                if(err) throw(err);
                fn(res?false:true);
            })
        }
        else fn(true,"User doesn't exists");
    });
}

function setState(id,state,fn){
    isRegistered(id,function(r){
        if(r){
            Redis.hset("user:"+id,"state",state,function (err,res) {
                if(err) throw(err);
                fn(res?false:true);
            })
        }
        else fn(true,"User doesn't exists");
    });
}