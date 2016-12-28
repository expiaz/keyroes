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

        var user = {},
            connected = io.sockets.connected;

        function error(err,nsp){
            console.log("server-error report : "+err);
            if(nsp) io.to(nsp).emit("server-error",err);
            else socket.emit("server-error",err);
        }

        function Hydrate(fn){
            Dispatcher.getUser(socket.id,function (err,fetch_user) {
                if(err){
                    error(fetch_user);
                    user = {};
                    return fn({});
                }
                user = fetch_user ? fetch_user : {};
                return fn(fetch_user ? fetch_user : {});
            });
        }

        socket.on('register', function (username,fn) {
            Dispatcher.registerHandler(socket.id,username,function(e,r){
                if(e){
                    error(r);
                    return fn ? fn(false) : '';
                }
                Hydrate(function (datas) {
                    socket.join('HALL');
                    return fn ? fn(true) : '';
                });
            });
        });

        socket.on('addQueue', function(fn)  {
            Hydrate(function (datas) {
                if(!datas.id) return error("You must be logged in to join mma");
                Dispatcher.addQueueHandler(socket.id, function(err, res){
                    if(err){
                        error(res);
                        return fn ? fn(false) : '';
                    }
                    fn ? fn(true) : '';
                    triggerQueue();
                });
            });
        });

        function triggerQueue(){
            Dispatcher.triggerQueueHandler(function(err,res,matched,players) {
                if(err) return error(res);
                if(!players) return;
                if(matched) opponentFoundcreateMatch(players);
            });
        }

        function opponentFoundcreateMatch(players){
            Dispatcher.opponentFoundcreateMatchHandler([players.p1,players.p2],function(err,res){
                if(err) return error(res);
                matchmaking_angle = 0;
                matchmaking_timer.on('ontick',sendMatchTick);
                matchmaking_timer.on('end',opponentFoundAnswerCheckAnswers);
                matchmaking_timer.start(5);
                connected[players.p1].join("match:"+players.p1+""+players.p2);
                connected[players.p2].join("match:"+players.p1+""+players.p2);
                io.to("match:"+players.p1+""+players.p2).emit('gameFound');
            });
        }

        function sendMatchTick(millis){
            Hydrate(function(datas){
                Dispatcher.getMatch(datas.match,function (err,fetch_match) {
                    if(err) return error(fetch_match);
                    if(!fetch_match) return;
                    var time = (millis/1000).toFixed(1);
                    matchmaking_angle += matchmaking_incrementAngle;
                    io.to("match:"+fetch_match.p1+""+fetch_match.p2).emit('gameFoundTick',{angle:matchmaking_angle,time:time});
                });
            });
        }

        socket.on('gameFoundPlayerAnswer', function(answer){
            Hydrate(function(datas) {
                if(!datas.id) return error("You must be logged in to join mma");
                if(parseInt(datas.match) == 0) return error("You must be matched to join one");
                if(parseInt(datas.answertomatch) != -1) return error("You already "+ (parseInt(datas.answertomatch) ? 'accepted' : 'declined') + " this match");
                Dispatcher.opponentFoundPlayerAnswerHandler(socket.id,answer,function(err,res) {
                    if(err) error(res);
                });
            });
        });

        function opponentFoundAnswerCheckAnswers(){
            Dispatcher.opponentFoundPlayerAnswerCheckAnswersHandler(socket.id,function (err,players,isMatchCreated) {
                if(err) return error(players);
                if(!players) return;
                var created = isMatchCreated ? 'gameFoundAccepted' : 'gameFoundDeclined';
                io.to("match:"+players.p1+""+players.p2).emit(created);
                if(isMatchCreated) createGame(players);
            });
        }

        function createGame(players){
            Dispatcher.createGameHandler(players,function (err,res) {
                if(err) return error(res);
                Hydrate(function(datas) {
                    connected[players.p1].leave('HALL');
                    connected[players.p2].leave('HALL');
                    connected[players.p1].leave("match:"+players.p1+""+players.p2);
                    connected[players.p2].leave("match:"+players.p1+""+players.p2);
                    connected[players.p1].join("players:"+datas.game);
                    connected[players.p2].join("players:"+datas.game);
                    Dispatcher.getUser(players.p1,function (err,user_fetch_1) {
                        if(err) return error(user_fetch_1);
                        if(!user_fetch_1) return;
                        Dispatcher.getUser(players.p2,function (err,user_fetch_2) {
                            if(err) return error(user_fetch_2);
                            if(!user_fetch_2) return;
                            io.to("players:"+datas.game).emit("gameBegin",{p1:user_fetch_1.username,p2:user_fetch_2.username});
                            sendLetter();
                        });
                    });
                });
            });
        }

        socket.on('playerKeypress',function (keycode) {
            if(!user.id) return;
            Hydrate(function(datas){
                if(!datas.id) return;
                if(parseInt(datas.game) == 0) return;
                if(!checkKeycode(keycode)) return;
                playerKeypress(keycode);
            });
        });

        function checkKeycode(keycode){
            return ((keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122));
        }

        function playerKeypress(keycode){
            Hydrate(function (datas) {
                Dispatcher.playerKeypressHandler(datas.id,datas.game,keycode,function (err,good_answer) {
                    if(err) return error(good_answer);
                    Dispatcher.fetchLetterTypeHistory(datas.game, function (err,typehistory) {
                        if(err) return error(typehistory);
                        if(!typehistory) return;
                        //history : [{user:{username:X},letter:X},...]
                        io.to("players:"+datas.game).emit('majLetterTypeHistory',typehistory);
                        Dispatcher.getGamePoints(datas.game,function (err,points) {
                            if(err) return error(points);
                            if(!points) return;
                            //points {p1:{username:X,points:X},p2{username:X,points:X}}
                            io.to("players:"+datas.game).emit('majPoints',points);
                            if(good_answer){
                                Dispatcher.fetchLetterHistory(datas.game,function (err,history) {
                                    if(err) return error(history);
                                    if(!history) return;
                                    //typehistory : [{user:{username:str},letter:str,answer:bool,color:str},...]
                                    io.to("players:"+datas.game).emit('majLetterHistory',history);
                                    sendLetter();
                                });
                            }
                        });
                    });
                });
            });
        }

        function sendLetter() {
            Hydrate(function (datas) {
                Dispatcher.getActualLetter(datas.game,function (err,letter) {
                    if(err) return error(letter);
                    io.to("players:"+datas.game).emit('sendLetter',letter.char);
                });
            });
        }

        socket.on('stopTimer',function (state) {
            console.log("stop_timer "+socket.id);
            Dispatcher.getUser(socket.id,function (err,user) {
                if(err) return error(user);
                switch(state){
                    case 'MATCHED':
                        if(parseInt(user.match) == 0) break;
                        matchmaking_timer.stop();
                        break;
                    case 'IN_GAME':
                        if(parseInt(user.game) == 0) break;
                        game_timer.stop();
                        break;
                }
            });
        });

        socket.on('disconnect',function () {
            console.log("disconnect "+socket.id);
            Dispatcher.DisconnectHandler(socket.id,function (err,state,room,me,opp) {
                if(err) return error(state);
                switch(state){
                    case 'HALL':
                        break;
                    case 'QUEUE':
                        break;
                    case 'MATCHED':
                        io.to("match:"+room).emit('disconnection','MATCHED');
                        connected[opp].leave("match:"+room);
                        matchmaking_timer.stop();
                        break;
                    case 'IN_GAME':
                        io.to("players:"+room).emit('disconnection','IN_GAME');
                        connected[opp].leave("players:"+room);
                        game_timer.stop();
                        break;
                }
            });
        });

    });

}

module.exports = socketing;
