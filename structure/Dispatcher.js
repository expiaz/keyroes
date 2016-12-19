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
    fetchActualLetter: fetchActualLetter,
    fetchLetterHistory: fetchLetterHistory,
    fetchPoints: fetchPoints,

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

function createGame(players,fn) {
    Controllers.User.getUsers([players.p1,players.p2], function(err,users){
        if(err){
            fn(true,"Pb retieving the users (createMatch)");
            return;
        }
        var ack = false;
        users.forEach(function (user) {
            if(!(parseInt(user.game) == 0)){
                ack = true;
                return;
            }
        });
        if(ack){
            fn(false,"User already in a game");
            return;
        }
        var game = new Game(players.p1+""+players.p2,players.p1,players.p2);
        Controllers.Game.Model.Redis.addGame(game,function (err,res) {
            if(err){
                fn(true,"Error adding the game");
                return;
            }
            Controllers.User.setUsers([players.p1,players.p2],{game:game.id,state:"IN_GAME"},function(err,rep){
                if(err) fn(true,rep);
                else pushLetterInGame(game.id,function (err,res) {
                    if(err){
                        fn(true,"Error pushing letter to game");
                        return;
                    }
                    fn(false,"Game created and ready");
                });
            });
        });
    });
}

function fetchActualLetter(game_id,fn){
    console.log("a");
    Controllers.Letter.Model.Redis.getLetters(game_id,function (err,letters) {
        console.log("b");
        if(err){
            fn(true,letters);
            return;
        }
        var ack = false,
            ack_letter = {};
        for(var letter_id in letters){
            console.log("c");
            if(parseInt(letters[letter_id]) == 0){

                console.log("d");
                Controllers.Letter.Model.Redis.getLetter(letter_id,function (err,letter) {
                    console.log("e");
                    if(err){
                        ack = true;
                        return;
                    }
                    ack_letter = letter;
                });
                console.log("f");
                break;
            }
            console.log("g");
        }
        console.log("h");
        if(ack) fn(true,"Problem fetching actual letter");
        else fn(false,ack_letter);
    })
}

function playerKeypress(user_id,game_id,keycode,fn){
    console.log("playerKeypressfef "+keycode);
    fetchActualLetter(game_id,function (err,letter) {
        console.log("gzrgsgr");
        if(err){
            fn(true,letter);
            return;
        }
        Controllers.Game.Model.Redis.getGame(game_id,function (err,game) {
            console.log(letter.code+" = "+keycode);
            if(err){
                fn(true,game);
                return;
            }
            if(letter.code == keycode){
                console.log("good");
                var props;
                if(user_id == game.p1) props = {
                    p1_score: game.p1_score + 1
                }
                else props = {
                    p2_score: game.p2_score + 1
                }
                pushLetterInGame(game_id,function (err,res) {
                    if(err){
                        fn(true,res);
                        return;
                    }
                    Controllers.Game.Model.setGame(game_id,props,function (err,res) {
                        if(err) fn(true,res);
                        else fn(false,true);
                    });
                });
            }
            else {
                var props;
                if(user_id == game.p1){

                    props = {
                        p1_score: game.p1_score > 0 ? game.p1_score - 1 : 0
                    }
                }
                else {
                    props = {
                        p2_score: game.p2_score > 0 ? game.p2_score - 1 : 0
                    }
                }
                Controllers.Game.Model.setGame(game_id,props,function (err,res) {
                    if(err) fn(true,res);
                    else fn(false,false);
                });
            }
        });
    });
}

function getMatchOf(user_id,fn){
    Controllers.User.Model.Redis.getUser(user_id,function (err,user) {
        if(err){
            fn(true,user);
            return;
        }
        Controllers.Game.Model.Redis.getGame(user.game,function (err,game) {
            if(err) fn(true,game);
            else fn(false,game);
        });
    });
}

function pushLetterInGame(game_id,fn){
    Controllers.Letter.Model.Redis.addLetter(game_id,function (err,res) {
        if(err){
            fn(true,res);
            return;
        }
        fn(false,"Letter pushed");
    });
}



function fetchLetterHistory(game_id,fn){
    Controllers.Letter.Model.Redis.getLetters(game_id,function (err,letters) {
        if(err){
            fn(true,letters);
            return;
        }
        var history = [],
            ack = false;
        for(var letter_id in letters){
            if(parseInt(letters[letter_id]) != 0){
                Controllers.Letter.Model.Redis.getLetter(letter_id,function (err,letter) {
                    if(err){
                        ack = true;
                        return;
                    }
                    history.push({
                       letter:letter.char,
                       player:letters[letter.id],
                       color:'green'
                    });
                });
            }
        }
        if(ack) fn(false,"Problem generating history");
        else fn(false,history);
    });
}

function fetchPoints(game_id,fn){
    Controllers.Game.Model.Redis.getGame(game_id,function (err,game) {
        if(err){
            fn(true,game);
            return;
        }
        var points = {};
        Controllers.User.getUsers([game.p1,game.p2],function (err,users) {
            if(err){
                fn(true,users);
                return;
            }
            users.forEach(function (user) {
                if(game.p1 == user.id) points[user.username] = game.p1_score;
                else points[user.username] = game.p2_score;
            });
            fn(false,points);
        });

    });
}