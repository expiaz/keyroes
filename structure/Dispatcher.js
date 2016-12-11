var Redis = require('./Redis');
var Socket = require('./Socket');
var User = require('./User');

function Register(id,username,fn){
    var user = new User(id,username);
    Redis.Users.setUser(user,function(e,r){
        if(e) fn(e,r);
        else fn(e,user);
    });
}



/*
function isRegistered(id,fn){
    Redis.get("user:"+id,function(err,res){
        if(err) throw(err);
        fn(res ? true : false );
    });
}

function setSocket(socket,fn){
    if(isRegistered(socket.id)){
        fn(true,"User already exists");
        return;
    }
    Redis.hmset("user:"+socket.id+":socket",socket,function(err,res){
        if(err) fn(true,"Problem adding socket "+socket.id);
        else fn(false,true);
    });
}

function getSocket(id,fn){
    if(!isRegistered(id)){
        fn(-1,"User doesn't exists");
        return;
    }
    Redis.hgetall("user:"+id+":socket", function (err, res){
        if(err) fn(true,"Problem retrieving socket hset");
        else fn(false,res);
    });
}

function setUser(user,fn){
    if(isRegistered(user.id)){
        fn(true,"User already exists");
        return;
    }
    Redis.multi()
        .sadd("users",user.id)
        .hmset("user:"+user.id,user)
        .exec(function(err){
           if(err) fn(true,"Problem adding user "+user.id);
           else fn(false,user);
        });
}

function getUser(id,fn){
    if(!isRegistered(id)){
        fn(true,"User doesn't exists");
        return;
    }
    Redis.hgetall("user:"+id, function (err, res){
        if(err) fn(true,"Problem retrieving user hset");
        else fn(false,res);
    });
}

function Register(id,username,socket,fn){
    var user = new User(id,username);

    setSocket(socket,function(state,msg){
        if(state){
            fn(true,msg);
            return;
        }
    });
    setUser(user,function(state,msg){
        if(state){
            fn(true,msg);
            return;
        }
        fn(false,msg);
    });
}

function isQueued(id){
    return Redis.sscan("queue","0","match",id,"count","1",function(err,replies){
        return replies[1].length == 1;
    });
}

function addMma(id,fn){
    if(!isRegistered(id)){
        fn(true,"User doesn't exists");
        return;
    }
    if(isQueued(id)){
        fn(true,"User already in queue");
        return;
    }
    Redis.multi()
        .sadd("queue",id)
        .hset("user"+id,"state","queue")
        .exec(function(err){
           if(err) fn(true,"Problem joining mma");
        });

    triggerMma(function(state,msg){
        if(state) fn(true,"Error triggerring mma");
        else fn(state,msg);
    });
}

function dropMma(id,fn){
    if(!isQueued(id)){
        fn(true,"User doesn't exists");
        return;
    }
    return Redis.srem("queue",id,function(err,res){
        res ? false : true;
    });
}

function triggerMma(fn){
    var p1,p2;

    Redis.smembers("queue",function(err,users){
        while(users.length >= 2 && users.length%2 == 0){
            getSocket(users[0], function(state,msg){
                if(state) fn(true,msg);
                else p1 = msg;
            });
            getSocket(users[1], function(state,msg){
                if(state) fn(true,msg);
                else p2 = msg;
            });
            dropMma(p1.id);
            dropMma(p2.id);
            fn(false,{p1:p1,p2:p2});
        }

    });

}

*/

module.exports.Register = Register;
