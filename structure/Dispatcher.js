var User = require('./User');
var Match = require('./Match');
var Game = require('./Game');
var Controllers = {
    User: require('./controllers/User'),
    Game: require('./controllers/Game'),
    Queue: require('./controllers/Queue'),
    Match: require('./controllers/Match')
};

var Dispatcher = {
    registerHandler: register,
    addQueueHandler: Controllers.Queue.Model.Redis.addQueue,
    triggerStateHandler: Controllers.Queue.triggerQueue,
    gameFoundcreateMatchHandler: gameFoundcreateMatch,
    gameFoundPlayerAnswerHandler: gameFoundPlayerAnswer,
    gameFoundPlayerAnswerCheckAnswersHandler: gameFoundPlayerAnswerCheckAnswers,

    getMatch: Controllers.Match.Model.Redis.getMatch,
    getUser: Controllers.User.Model.Redis.getUser,

}
module.exports = Dispatcher;

function register(id,username,fn){
    var user = new User(id,username);
    Controllers.User.Model.Redis.addUser(user,function(e,r){
        if(e) fn(e,r);
        else fn(e,user);
    });
}

function gameFoundcreateMatch(ids,fn){
    Controllers.User.getUsers(ids, function(err,users){
        if(err){
            fn(true,"Pb retieving the users (createMatch)");
            return;
        }
        var ack = false;
        users.forEach(function (user) {
            if(user.match != false){
                ack = true;
                return;
            }
        });
        if(ack){
            fn(false,"User already in a match");
            return;
        }
        var match = new Match(ids[0]+""+ids[1],ids[0],ids[1]);
        Controllers.Match.Model.Redis.addMatch(match,function(err,rep){
            if(err){
                fn(true,"Error adding the match");
                return;
            }
            Controllers.User.setUsers(ids,{match:match.id},function(err,rep){
                if(err){
                    fn(true,rep);
                    return;
                }
                fn(false,match.id);
            });
        });
    })
}

function gameFoundPlayerAnswer(player_id,answer,fn){

    Controllers.User.Model.Redis.getUser(player_id,function (err,fetch_user) {
        if(err){
            fn(true,fetch_user);
            return;
        }
        var a = answer?1:0;
        Controllers.User.Model.Redis.setUser(fetch_user.id,{answertomatch:a},function (err,res) {
            if(err){
                fn(true,res);
                return;
            }
            Controllers.Match.Model.Redis.getMatch(fetch_user.match,function(err,fetch_match){
                if(err){
                    fn(true,res);
                    return;
                }
                var props = fetch_user.id == fetch_match.p1 ? {p1_answer:a} : {p2_answer:a};
                Controllers.Match.Model.Redis.setMatch(fetch_user.match,props,function(err,rep){
                    if(err){
                        fn(true,rep);
                        return;
                    }
                    fn(false,"User & Match hashes updates (gameFoud)");
                });
            });
        });
    })


}

function gameFoundPlayerAnswerCheckAnswers(player_id,fn){
    //getMatch
    Controllers.User.Model.Redis.getUser(player_id,function (err,fetch_user) {
        if(err){
            fn(true,fetch_user);
            return;
        }
        Controllers.Match.Model.Redis.getMatch(fetch_user.match,function (err,fetch_match) {
            if(err){
                fn(true,fetch_match);
                return;
            }
            var props,
                acceptance = parseInt(fetch_match.p1_answer) && parseInt(fetch_match.p2_answer);
            if(acceptance) props = {
                    state: 'IN_GAME'
                };
            else props = {
                    match:0,
                    state: 'HALL',
                    answertomatch: -1
                };

            Controllers.User.setUsers([fetch_match.p1,fetch_match.p2],props,function (err,rep) {
                if(err){
                    fn(true,rep);
                    return;
                }
                Controllers.Match.Model.Redis.delMatch(fetch_match.id,function(err,rep){
                    if(err){
                        fn(true,rep);
                        return;
                    }
                    fn(false,{p1:fetch_match.p1,p2:fetch_match.p2},acceptance);
                });
            });
        });
    })

}