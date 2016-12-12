var Redis = require('./redis/Redis_server');

module.exports.addQueue = addQueue;
module.exports.dropQueue = dropQueue;
module.exports.addGame = addGame;

function addQueue(id,fn){
    isQueued(id,function(r){
        if(r){
            fn(true,"User already in queue");
        }
        else{
            Redis.multi()
                .sadd("queue",id)
                .hset("user:"+id,"state","queue")
                .exec(function(err){
                    if(err) throw(err);
                    triggerMma(fn);
                });
        }
    });
}

function dropQueue(id,fn){
    isQueued(id,function(r){
        if(!r){
            //fn(true,"User isn't in queue");
        }
        else{
            Redis.srem("queue",id,function(err,res){
                if(err) throw(err);
                //fn(res?true:false);
            });
        }
    });
}

function addGame(players,fn){
    // fn(err,game_id,players)

}

/**
 * UTILS
 */

function isQueued(id,fn){
    Redis.sscan("queue","0","match",id,"count","1",function(err,replies){
        if(err) throw(err);
        fn(replies[1].length == 1);
    });
}

function triggerMma(fn){
    //fn(err,msg,trigger,players)
    Redis.smembers("queue",function(err,users){
        if(err) throw(err);
        if(users.length >= 2 && users.length%2 == 0){
            var p1,p2;
            p1 = users[0];
            p2 = users[1];
            fn(false,"",true,{p1:p1,p2:p2});
            dropQueue(p1);
            dropQueue(p2);
        }
        else{
            fn(false,"",false,{});
        }
    });
}

