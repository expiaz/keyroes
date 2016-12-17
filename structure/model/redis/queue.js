var Redis = require('./server');

var Queue = {
    getQueue: getQueue,
    addQueue: addQueue,
    dropQueue: dropQueue
};

module.exports = Queue;

function isQueued(id,fn){
    Redis.sscan("queue","0","match",id,"count","1",function(err,replies){
        if(err) throw(err);
        fn(replies[1].length == 1);
    });
}

function getQueue(fn){
    //fn(err,msg,trigger,players)
    Redis.smembers("queue",function(err,users){
        if(err) throw(err);
        fn(false,users);
    });
}

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
                    fn(false,"User added in queue");
                    //triggerMma(fn);
                });
        }
    });
}

function dropQueue(id,fn){
    isQueued(id,function(r){
        if(!r){
            console.log("[MODEL-QUEUE] Error : "+id+" is not registered on queue");
            fn(true,"User isn't in queue");
        }
        else{
            Redis.srem("queue",id,function(err,res){
                if(err) throw(err);
                console.log(id+" deleted from queue ("+ (res?false:true) +")");
                fn(res?false:true);
            });
        }
    });
}

