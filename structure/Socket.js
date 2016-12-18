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

        function error(err){
            console.log("server-error report : "+err);
            socket.emit("server-error",err);
        }

        socket.on('register', function (username,fn) {
            Dispatcher.Register(socket.id,username,function(e,r){
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

        socket.on('addMma', function(fn)  {
            if(!user.id){
                error("You must be logged in to join mma");
                return;
            }
            Dispatcher.addQueue(socket.id, function(e, r){
                if(e){
                    error(r);
                    fn(false);
                }
                else{
                    fn(true);
                    queueState();
                }
            });
        });

        socket.on('gameFound_answer', function(answer){
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
                var a = answer?1:0;
                Dispatcher.setUser(user.id,{answertomatch:a},function (err,res) {
                    if(err){
                        error(res);
                        return;
                    }
                    Dispatcher.getMatch(user.match,function(err,fetch_match){
                        if(err){
                            error(res);
                            return;
                        }
                        var props = socket.id == fetch_match.p1 ? {p1_answer:a} : {p2_answer:a};
                        Dispatcher.setMatch(user.match,props,function(err,rep){
                            if(err) error(rep);
                        });
                    });
                });
            });
        });

        function queueState(){
            Dispatcher.triggerQueue(function(err,res,ack,players){
                if(err){
                    error(res);
                    return;
                }
                if(ack) createMatch(players);
            });
        }

        function createMatch(players){
            console.log("createMatch");

            connected[players.p1].emit('gameFound');
            connected[players.p2].emit('gameFound');

            Dispatcher.createMatch([players.p1,players.p2],function(err,rep){
                if(err){
                    error(rep);
                    return;
                }
                matchmaking_angle = 0;
                matchmaking_timer.on('ontick',sendMatchTick);
                matchmaking_timer.on('end',createMatchHandler);
                matchmaking_timer.start(5);
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
                    connected[fetch_match.p1].emit('gameFound_tick',{angle:matchmaking_angle,time:time});
                    connected[fetch_match.p2].emit('gameFound_tick',{angle:matchmaking_angle,time:time});
                });
            });
        }

        function createMatchHandler(){
            console.log("createMatchHandler");
            // create a game or not deciding from users answers
            Hydrate(function (err,res) {
                if(err){
                    error(res);
                    return;
                }
                Dispatcher.getMatch(user.match,function (err,fetch_match) {
                    if(err){
                        error(fetch_match);
                        return;
                    }
                    //console.log(parseInt(fetch_match.p1_answer)+" && "+parseInt(fetch_match.p2_answer)+" = "+(parseInt(fetch_match.p1_answer) && parseInt(fetch_match.p2_answer)))
                    if(parseInt(fetch_match.p1_answer) && parseInt(fetch_match.p2_answer)){
                        var props = {
                            state: 'IN_GAME'
                        }
                        Dispatcher.setUsers([fetch_match.p1,fetch_match.p2],props,function (err,rep) {
                            if(err){
                                error(rep);
                                return;
                            }
                            Dispatcher.delMatch(fetch_match.id,function(err,rep){
                                if(err){
                                    error(rep);
                                    return;
                                }
                                connected[fetch_match.p1].emit('accepted');
                                connected[fetch_match.p2].emit('accepted');
                                createGame([fetch_match.p1,fetch_match.p2]);
                            });
                        });
                    }
                    else{
                        var props = {
                            match:0,
                            state: 'HALL',
                            answertomatch: -1
                        }
                        Dispatcher.setUsers([fetch_match.p1,fetch_match.p2],props,function (err,rep) {
                            if(err){
                                error(rep);
                                return;
                            }
                            Dispatcher.delMatch(fetch_match.id,function(err,rep){
                                if(err){
                                    error(rep);
                                    return;
                                }
                                connected[fetch_match.p1].emit('declined');
                                connected[fetch_match.p2].emit('declined');
                            });
                        });
                    }
                });
            });
        }

        function createGame(ids){
            console.log("createGame");
        }

    });

}

module.exports = socketing;
