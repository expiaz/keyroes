var QueueModelRedis = require('./../model/redis/queue');

var Queue = {
    Model: {
        Redis: QueueModelRedis
    },
    triggerQueue: triggerQueue,
    dropQueues:dropQueues,
}

module.exports = Queue;

function dropQueues(ids,fn){
    var stop = ids.length;
    ids.forEach(function (id) {
        QueueModelRedis.dropQueue(id,function (err,res) {
            if(err) return fn(true,res);
            if(--stop == 0) return fn(false);
        });
    });
}

function triggerQueue(fn){
    QueueModelRedis.getQueue(function(err,users){
        if(err) return fn(true,users);
        if(users.length >= 2 && users.length%2 == 0){
            var p1 = users[0],
                p2 = users[1];
            dropQueues([p1,p2],function (err,res) {
                return fn(false,null,true,{p1:p1,p2:p2});
            });
        }
        else return fn(false,null,false);
    });
}