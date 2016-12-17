var User = require('./User');
var Match = require('./Match');
var Socket = require('./Socket');

var db = {
    Redis:
    {
        Queue: require('./model/redis/queue'),
        Game: require('./model/redis/game'),
        User: require('./model/redis/user'),
        Match: require('./model/redis/match')
    },
    Sql:
    {
        Game: require('./model/sql/game'),
        User: require('./model/sql/user')
    }
};

var Controllers = {
    User: require('./controllers/User'),
    Game: require('./controllers/Game'),
    Queue: require('./controllers/Queue')
};


var Dispatcher = {
    Register: Register,
    addQueue: addQueue,
    addMatch: addMatch,
    getMatch: getMatch,
    getUser: getUser,
    setMatch: setMatch,
    setUser: setUser
}

module.exports = Dispatcher;

function Register(id,username,fn){
    var user = new User(id,username);
    db.Redis.User.addUser(user,function(e,r){
        if(e) fn(e,r);
        else fn(e,user);
    });
}

function addQueue(id,fn){
    db.Redis.Queue.addQueue(id,function(err,msg){
        if(err) fn(true,msg);
        else{
            Controllers.Queue.triggerQueue(function(err,msg,ack,players){
                if(err) fn(true,msg);
                else fn(false,msg,ack,players);
            });
        }
    });
}

function addMatch(ids,fn){
    console.log(" add match ids");
    console.log(ids);
    console.log(ids[0]);
    console.log(ids[1]);

    db.Redis.User.getUser(ids[0], function(err,user_1){
        console.log("a");
        if(err) fn(true,"Pb retieving the user (createMatch) user1");
        else{
            console.log("b");
            console.log("user1");
            console.log(user_1)
            if(user_1.match != 0) fn(false,"User already in a match");
            else{
                console.log("c");
                db.Redis.User.getUser(ids[1], function(err,user_2){
                    console.log("d");
                    console.log(user_2)
                    if(err) fn(true,"Pb retieving the user (createMatch) user2");
                    else {
                        console.log("e");
                        if (user_2.match != 0) fn(false, "User already in a match");
                        else {
                            console.log("f");
                            var match = new Match(ids[0]+""+ids[1]);
                            match.p1 = ids[0];
                            match.p2 = ids[1];
                            console.log("match");
                            console.log(match);
                            db.Redis.Match.addMatch(match,function(err,rep){
                                console.log("g");
                                if(err) fn(true,"Error adding the match");
                                else{
                                    console.log("h");
                                    db.Redis.User.setUser(ids[0],{match:match.id},function(err,rep){
                                        console.log("i");
                                        if(err) fn(true,rep);
                                        else{
                                            console.log("j");
                                            db.Redis.User.setUser(ids[1],{match:match.id},function(err,rep){
                                                console.log("k");
                                                if(err) fn(true,rep);
                                                fn(false,ids[0]+""+ids[1]);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    })




}

function getMatch(id,fn){
    db.Redis.Match.getMatch(id,function (err,rep) {
        if(err) fn(true,rep);
        else fn(false,rep);
    });
}

function getUser(id,fn){
    db.Redis.User.getUser(id,function (err,rep) {
        if(err) fn(true,rep);
        else fn(false,rep);
    });
}

function setMatch(id,prop,value,fn){
    db.Redis.Match.setMatch(id,prop,value,function (err,rep) {
        if(err) fn(true,rep);
        else fn(false,rep);
    });
}

function setUser(id,props,fn){
    db.Redis.User.setUser(id,props,function (err,rep) {
        if(err) fn(true,rep);
        else fn(false,rep);
    });
}