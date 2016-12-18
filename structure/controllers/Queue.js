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
    var ack = false;
    ids.forEach(function (id) {
        QueueModelRedis.dropQueue(id,function (err,res) {
            ack == ack && (err?true:false);
        });
    });
    if(ack) fn(true,"Fail dropping queues");
    else fn(false,"Done dropping queues");
}

function triggerQueue(fn){
    QueueModelRedis.getQueue(function(err,users){
        if(err){
            fn(true,"Can't get the queue");
            return;
        }
        if(users.length >= 2 && users.length%2 == 0){
            var p1 = users[0],
                p2 = users[1];

            dropQueues([p1,p2],function (err,res) {
                if(err){
                    fn(true,res);
                    return;
                }
                fn(false,"Done triggering queue : created",true,{p1:p1,p2:p2});
            });
        }
        else fn(false,"Done triggering queue : aborted",false);
    });
}