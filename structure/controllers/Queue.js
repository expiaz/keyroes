var QueueModel = require('./../model/redis/queue');

var Queue = {
    triggerQueue: triggerQueue
}

module.exports = Queue;

function triggerQueue(fn){
    QueueModel.getQueue(function(err,users){
        if(err) fn(true,"Can't get the queue");
        else{
            if(users.length >= 2 && users.length%2 == 0){
                var p1,p2;
                p1 = users[0];
                p2 = users[1];
                console.log(" players for this match : ");
                console.log(users);

                QueueModel.dropQueue(p1,function (err,msg) {
                    if(err) fn(true,msg);
                    else{
                        QueueModel.dropQueue(p2,function (err,msg) {
                            if(err) fn(true,msg);
                            else fn(false,"",true,{p1:p1,p2:p2});
                        });
                    }
                });
            }
            else fn(false,"",false);
        }
    });
}