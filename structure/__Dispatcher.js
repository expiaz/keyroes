var User = require('./class/User');
var Match = require('./class/Match');
var Game = require('./class/Game');
var Letter = require('./class/Letter');

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
    triggerQueueHandler: Controllers.Queue.triggerQueue,
    opponentFoundcreateMatchHandler: opponentFoundcreateMatch,
    opponentFoundPlayerAnswerHandler: opponentFoundPlayerAnswer,
    opponentFoundPlayerAnswerCheckAnswersHandler: opponentFoundPlayerAnswerCheckAnswers,
    createGameHandler: createGame,
    playerKeypressHandler: playerKeypress,
    getActualLetter: Controllers.Game.getActualLetter,
    fetchLetterHistory: fetchLetterHistory,
    getGamePoints: getGamePoints,
    fetchLetterTypeHistory:fetchLetterTypeHistory,
    DisconnectHandler:DisconnectHandler,

    getMatch: Controllers.Match.Model.Redis.getMatch,
    getUser: Controllers.User.Model.Redis.getUser,

}
module.exports = Dispatcher;

function register(id,username,fn){
    var user = new User(id,username);
    Controllers.User.Model.Redis.addUser(user,function(err,res){
        if(err) return fn(true,res);
        fn(false,user);
    });
}

function opponentFoundcreateMatch(ids,fn){
    Controllers.User.getUsers(ids, function(err,users){
        if(err) return fn(true,users);
        if(parseInt(users[0].match) != 0 || parseInt(users[1].match) != 0) return fn(true,"User already matched");
        var match = new Match(users[0].id+""+users[1].id,users[0].id,users[1].id);
        Controllers.Match.Model.Redis.addMatch(match,function(err,res){
            if(err) return fn(true,res);
            Controllers.User.setUsers(ids,{match:match.id,state:"MATCHED"},function(err,res){
                if(err) return fn(true,res);
                fn(false,match.id);
            });
        });
    });
}

function opponentFoundPlayerAnswer(player_id,answer,fn){
    Controllers.User.Model.Redis.getUser(player_id,function (err,fetch_user) {
        if(err) return fn(true,fetch_user);
        Controllers.User.Model.Redis.setUser(fetch_user.id,{answertomatch:answer?1:0},function (err,res) {
            if(err) return fn(true,res);
            Controllers.Match.Model.Redis.getMatch(fetch_user.match,function(err,fetch_match){
                if(err) return fn(true,fetch_match);
                var props = fetch_user.id == fetch_match.p1 ? {p1_answer:answer?1:0} : {p2_answer:answer?1:0};
                Controllers.Match.Model.Redis.setMatch(fetch_user.match,props,function(err,res){
                    if(err) return fn(true,res);
                    fn(false);
                });
            });
        });
    });
}

function opponentFoundPlayerAnswerCheckAnswers(player_id,fn){
    Controllers.User.Model.Redis.getUser(player_id,function (err,fetch_user) {
        if(err) return fn(true,fetch_user);
        if(!fetch_user.match) return;
        Controllers.Match.Model.Redis.getMatch(fetch_user.match,function (err,fetch_match) {
            if(err) return fn(true,fetch_match);
            if(!fetch_match) return;
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
            Controllers.User.setUsers([fetch_match.p1,fetch_match.p2],props,function (err,res) {
                if(err) return fn(true,res);
                Controllers.Match.Model.Redis.delMatch(fetch_match.id,function(err,res){
                    if(err) return fn(true,res);
                    fn(false,{p1:fetch_match.p1,p2:fetch_match.p2},acceptance);
                });
            });
        });
    })

}

function createGame(players,fn) {
    Controllers.User.getUsers([players.p1,players.p2], function(err,users){
        if(err) return fn(true,users);
        if(parseInt(users[0].game) != 0 || parseInt(users[1].game) != 0) return fn(true,"User already in a game");
        var game = new Game(players.p1+""+players.p2,players.p1,players.p2);
        Controllers.Game.Model.Redis.addGame(game,function (err,res) {
            if(err) return fn(true,res);
            Controllers.Game.addLetterToGame(game.id,function (err,res) {
                if(err) return fn(true,res);
                Controllers.User.setUsers([players.p1,players.p2],{game:game.id,state:"IN_GAME"},function(err,rep){
                    if(err) return fn(true,rep);
                    fn(false);
                });
            });
        });
    });
}

function playerKeypress(user_id,game_id,keycode,fn){
    Controllers.Game.getActualLetter(game_id,function (err,actual_letter) {
        if(err) return fn(true,actual_letter);
        Controllers.Game.Model.Redis.getGame(game_id,[],function(err,game) {
            if(err) return fn(true,game);
            var props,
                isGoodAnswer;
            if(actual_letter.code == keycode){
                isGoodAnswer = 1;
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
                isGoodAnswer = 0;
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
                Controllers.Letter.addLetterToTypeHistory(game_id,user_id,keycode,isGoodAnswer,function (err,res) {
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
    });
}

function fetchLetterHistory(game_id,fn){
    Controllers.Letter.fetchLetterHistory(game_id,function (err,letters) {
        if(err) return fn(true,letters);
        var ret = [];
        letters.forEach(function (letter) {
            Controllers.User.Model.Redis.getUser(letter.user,function (err,user) {
                if(err) return fn(true,user);
                ret.push({user:{username:user.username},letter:letter.letter});
                if(ret.length == letters.length) return fn(false,ret);
            });
        });
    });
}

function fetchLetterTypeHistory(game_id,fn){
    Controllers.Letter.fetchLetterTypeHistory(game_id,function (err,letters) {
        if(err) return fn(true,letters);
        var ret = [];
        letters.forEach(function (letter) {
            Controllers.User.Model.Redis.getUser(letter.user,function (err,user) {
                if(err) return fn(true,user);
                ret.push({
                    user:{username:user.username},
                    letter:String.fromCharCode(letter.letter),
                    color: letter.answer ? 'green' : 'red'
                });
                if(ret.length == letters.length) return fn(false,ret);
            });
        });
    });
}

function getGamePoints(game_id,fn){
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

function DisconnectHandler(user_id,fn){
    Controllers.User.Model.Redis.getUser(user_id,function (err,user) {
        if(err) return fn(true,user);
        switch(user.state){
            case 'HALL':
                break;
            case 'QUEUE':
                Controllers.Queue.Model.Redis.dropQueue(user.id,function (err,res) {
                    if(err) return fn(true,res);
                    Controllers.User.Model.Redis.delUser(user.id,function () {
                        fn(false,"QUEUE");
                    });
                });
                break;
            case 'MATCHED':
                Controllers.Match.Model.Redis.getMatch(user.match,function (err,match) {
                    if(err) return fn(true,match);
                    var opp = user.id == match.p1 ? match.p2 : match.p1;
                    Controllers.User.Model.Redis.setUser(opp,{state:'HALL',match:0,answertomatch:-1},function (err,res) {
                        if(err) return fn(true,res);
                        Controllers.Match.Model.Redis.delMatch(user.match,function (err,res) {
                            if(err) return fn(true,res);
                            Controllers.User.Model.Redis.delUser(user.id,function () {
                                fn(false,"MATCHED",user.match,user.id,opp);
                            });
                        });
                    });
                });
                break;
            case 'IN_GAME':
                Controllers.Game.Model.Redis.getGame(user.game,[],function (err,game) {
                    if(err) return fn(true,game);
                    var opp = user.id == game.p1 ? game.p2 : game.p1;
                    Controllers.User.Model.Redis.setUser(opp,{state:'HALL',game:0},function (err,res) {
                        if(err) return fn(true,res);
                        Controllers.Game.Model.Redis.delGame(user.game,function (err,res) {
                            if(err) return fn(true,res);
                            Controllers.User.Model.Redis.delUser(user.id,function () {
                                fn(false,"IN_GAME",user.game,user.id,opp);
                            });
                        });
                    });
                });
                break;
        }

    });
}