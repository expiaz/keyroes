var User = require('./User');
var Match = require('./Match');
var Game = require('./Game');
var Letter = require('./Letter');

var Controllers = {
    User: require('./controllers/User'),
    Game: require('./controllers/Game'),
    Queue: require('./controllers/Queue'),
    Match: require('./controllers/Match'),
    Letter: require('./controllers/Letter')
};

var Dispatcher = {
    registerHandler: register,
    addQueueHandler: Controllers.Queue.Model.Redis.addQueue,
    triggerStateHandler: Controllers.Queue.triggerQueue,
    gameFoundcreateMatchHandler: gameFoundcreateMatch,
    gameFoundPlayerAnswerHandler: gameFoundPlayerAnswer,
    gameFoundPlayerAnswerCheckAnswersHandler: gameFoundPlayerAnswerCheckAnswers,
    createGameHandler: createGame,
    playerKeypressHandler: playerKeypress,
    getActualLetter: Controllers.Game.getActualLetter,
    fetchLetterHistory: fetchLetterHistory,
    getGamePoints: getGamePoints,

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
            if(!(parseInt(user.match) == 0)){
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
            Controllers.User.setUsers(ids,{match:match.id,state:"MATCHED"},function(err,rep){
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
        if(err) return fn(true,fetch_user);
        Controllers.Match.Model.Redis.getMatch(fetch_user.match,function (err,fetch_match) {
            if(err) return fn(true,fetch_match);
            var props,
                acceptance = parseInt(fetch_match.p1_answer) && parseInt(fetch_match.p2_answer);
            if(acceptance) props = {
                    match:0,
                    state: 'IN_GAME',
                    answertomatch: -1
                };
            else props = {
                    match:0,
                    state: 'HALL',
                    answertomatch: -1
                };

            Controllers.User.setUsers([fetch_match.p1,fetch_match.p2],props,function (err,rep) {
                if(err) return fn(true,rep);
                Controllers.Match.Model.Redis.delMatch(fetch_match.id,function(err,rep){
                    if(err) return fn(true,rep);
                    fn(false,{p1:fetch_match.p1,p2:fetch_match.p2},acceptance);
                });
            });
        });
    })

}

function createGame(players,fn) {
    Controllers.User.getUsers([players.p1,players.p2], function(err,users){
        if(err) return fn(true,users);
        if(parseInt(users[0].game) != 0 && parseInt(users[1].game) != 0) return fn(true,"User already in a game");
        var game = new Game(players.p1+""+players.p2,players.p1,players.p2);
        Controllers.Game.Model.Redis.addGame(game,function (err,res) {
            if(err) return fn(true,res);
            Controllers.Game.addLetterToGame(game.id,function (err,res) {
                if(err) return fn(true,res);
                Controllers.User.setUsers([players.p1,players.p2],{game:game.id,state:"IN_GAME"},function(err,rep){
                    if(err) return fn(true,rep);
                    fn(false,"Game created and ready");
                });
            });
        });
    });
}

function playerKeypress(user_id,game_id,keycode,fn){
    console.log("playerKeypress");
    Controllers.Game.getActualLetter(game_id,function (err,actual_letter) {
        if(err) return fn(true,actual_letter);
        Controllers.Game.Model.Redis.getGame(game_id,[],function(err,game) {
            if(err) return fn(true,game);
            var props,
                isGoodAnswer;
            if(actual_letter.code == keycode){
                isGoodAnswer = true;
                if(user_id == game.p1){
                    props= {
                        p1_score: parseInt(game.p1_score) + 1
                    }
                }
                else{
                    props= {
                        p2_score: parseInt(game.p2_score) + 1
                    }
                }
            }
            else{
                isGoodAnswer = false;
                if(user_id == game.p1){
                    props= {
                        p1_score: parseInt(game.p1_score) > 0 ? parseInt(game.p1_score) - 1 : 0
                    }
                }
                else{
                    props= {
                        p2_score: parseInt(game.p2_score) > 0 ? parseInt(game.p2_score) - 1 : 0
                    }
                }
            }
            Controllers.Game.Model.Redis.setGame(game_id,props,function (err,res) {
                if(err) return fn(true,res);
                if(isGoodAnswer){
                    Controllers.Letter.addLetterToHistory(game_id,actual_letter.id,user_id,function (err,res) {
                        if(err) return fn(true,res);
                        Controllers.Game.addLetterToGame(game_id,function (err,res) {
                            if(err) return fn(true,res);
                            fn(false,true);
                        });
                    });
                }
                else{
                    fn(false,false);
                }
            });
        });
    });
}

function fetchLetterHistory(game_id,fn){
    console.log("fetchLetterHistory");
    Controllers.Letter.fetchLetterHistory(game_id,function (err,letters) {
        console.log(letters);
        if(err) return fn(true,letters);
        var ret = [];
        letters.forEach(function (letter) {
            Controllers.User.Model.Redis.getUser(letter.user,function (err,user) {
                if(err) return fn(true,user);
                ret.push({user:{username:user.username},letter:letter.letter.char});
                if(ret.length == letters.length) return fn(false,ret);
            })
        });
    });
}

function getGamePoints(game_id,fn){
    console.log("getGamePoints")
    Controllers.Game.Model.Redis.getGame(game_id,[],function (err,game) {
        if(err) return fn(true,game);
        var points = {
            p1:{
                username:null,
                points:null,
            },
            p2:{
                username:null,
                points:null,
            }
        };
        Controllers.User.getUsers([game.p1,game.p2],function (err,users) {
            if(err) return fn(true,users);
            switch(users[0].id){
                case game.p1:
                    points.p1.username = users[0].username;
                    points.p1.points = game.p1_score;
                    points.p2.username = users[1].username;
                    points.p2.points = game.p2_score;
                    break;
                case game.p2:
                    points.p1.username = users[1].username;
                    points.p1.points = game.p1_score;
                    points.p2.username = users[0].username;
                    points.p2.points = game.p2_score;
                    break;
            }
            fn(false,points);
        });

    });
}