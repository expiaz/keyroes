var socketio = require('socket.io');
var Dispatcher = require('./Dispatcher');
var mdtimer = require('timer.js');
/* TODO EVERYTHING */
function socketing(server){
    var io = socketio.listen(server);



    io.on('connection', function(socket) {
        //Handler(socket.id);

        /*mma timer*/
        const matchmaking_time = 5,
              matchmaking_incrementAngle = 0.02;
        var matchmaking_angle,
            matchmaking_timer = new mdtimer({
                tick : 0.1
            });
        matchmaking_timer.start(matchmaking_time);
        matchmaking_timer.pause();

        /*game timer*/
        const game_time = 60,
            game_incrementAngle = 0.017;
        var game_angle,
            game_timer = new mdtimer({
                tick : 1
            });
        game_timer.start(game_time);
        game_timer.pause();

        var user,
            connected = io.sockets.connected;

        function error(err){
            console.log("server-error report : "+err);
            socket.emit("server-error",err);
        }

        function Hydrate(fn){
            Dispatcher.getUser(socket.id,function (err,fetch_user) {
                if(err){
                    error(fetch_user);
                    user = {};
                    fn(true,fetch_user);
                }
                else{
                    user = fetch_user;
                    fn(false);
                }
            });
        }

        socket.on('register', function (username,fn) {
            Dispatcher.registerHandler(socket.id,username,function(e,r){
                if(e){
                    error(r);
                    fn(false);
                }
                else {
                    Hydrate(function (err,res) {
                        if(err){
                            error(res);
                            fn(false);
                        }
                        else fn(true);
                    });
                }
            });
        });

        socket.on('addQueue', function(fn)  {
            if(!user.id){
                error("You must be logged in to join mma");
                return;
            }
            Dispatcher.addQueueHandler(socket.id, function(err, res){
                if(err){
                    error(res);
                    fn(false);
                }
                else{
                    fn(true);
                    triggerQueue();
                }
            });
        });

        function triggerQueue(){
            Dispatcher.triggerStateHandler(function (err,res,matched,players) {
                if(err){
                    error(res);
                    return;
                }
                if(matched) gameFoundcreateMatch(players);
            });
        }

        function gameFoundcreateMatch(players){
            Dispatcher.gameFoundcreateMatchHandler([players.p1,players.p2],function(err,rep){
                if(err){
                    error(rep);
                    return;
                }
                matchmaking_angle = 0;
                matchmaking_timer.on('ontick',sendMatchTick);
                matchmaking_timer.on('end',gameFoundAnswerCheckAnswers);
                matchmaking_timer.start(5);
                connected[players.p1].emit('gameFound');
                connected[players.p2].emit('gameFound');
            });
        }

        function sendMatchTick(millis){
            Hydrate(function (err,res){
                if(err){
                    error(err);
                    return;
                }
                Dispatcher.getMatch(user.match,function (err,fetch_match) {
                    if(err){
                        error(fetch_match);
                        return;
                    }
                    var time = (millis/1000).toFixed(1);
                    matchmaking_angle += matchmaking_incrementAngle;
                    connected[fetch_match.p1].emit('gameFoundTick',{angle:matchmaking_angle,time:time});
                    connected[fetch_match.p2].emit('gameFoundTick',{angle:matchmaking_angle,time:time});
                });
            });
        }

        socket.on('gameFoundPlayerAnswer', function(answer){
            Hydrate(function (err,res) {
                if(err){
                    error(res);
                    return;
                }
                if(!user.id){
                    error("You must be logged in to join mma");
                    return;
                }
                if(parseInt(user.match) == 0){
                    error("You must be matched to join one");
                    return;
                }
                if(parseInt(user.answertomatch) != -1){
                    error("You already "+ (parseInt(user.answertomatch) ? 'accepted' : 'declined') + " this match");
                    return;
                }
                Dispatcher.gameFoundPlayerAnswerHandler(socket.id,answer,function (err,res) {
                    if(err) error(res);
                });
            });
        });

        function gameFoundAnswerCheckAnswers(){
            Hydrate(function (err,res) {
                if(err){
                    error(res);
                    return;
                }
                Dispatcher.gameFoundPlayerAnswerCheckAnswersHandler(socket.id,function (err,players,isMatchCreated) {
                    if(err){
                        error(players);
                        return;
                    }
                    var created = isMatchCreated ? 'accepted' : 'declined';
                    connected[players.p1].emit(created);
                    connected[players.p2].emit(created);
                    if(isMatchCreated) createGame([players.p1,players.p2]);
                });
            });
        }

        function createGame(ids){
            console.log("createGame");
        }

    });

}

module.exports = socketing;
