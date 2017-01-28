var Redis = require('./server');

var Queue = {
    getQueue: getQueue,
    addQueue: addQueue,
    dropQueue: dropQueue
};

module.exports = Queue;

function isQueued(id,fn){
    Redis.sscan("queue","0","match",id,"count","999",function(err,replies){
        if(err) throw new Error(err);
        fn(replies[1].length == 1);
    });
}

function getQueue(fn){
    Redis.smembers("queue",function(err,users){
        if(err) throw new Error(err);
        fn(false,users);
    });
}

function addQueue(id,fn){
    isQueued(id,function(r){
        if(r) return fn(true,"[Model:queue:addQueue] User already in queue");
        Redis.multi()
            .sadd("queue",id)
            .hmset("user:"+id,{state:"QUEUE"})
            .exec(function(err){
                if(err) throw new Error(err);
                fn(false);
            });
    });
}

function dropQueue(id,fn){
    isQueued(id,function(r){
        if(!r) return fn(true,"[Model:queue:dropQueue] User isn't in queue");
        Redis.srem("queue",id,function(err,res){
            if(err) throw new Error(err);
            fn(false);
        });
    });
}

