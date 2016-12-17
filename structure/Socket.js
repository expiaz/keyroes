var socketio = require('socket.io');
var Dispatcher = require('./Dispatcher');
var mdtimer = require('timer.js');
/* TODO EVERYTHING */
function socketing(server){
    var io = socketio.listen(server);
    var timer = new mdtimer({
        tick : 0.1
    });
    timer.start(5);
    timer.pause();
    var z = io.on('connection', function(socket) {
        var user,
            match,
            connected = io.sockets.connected;

        const time = 5;
        var angle;
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
                    user = r;
                    fn(true);
                }
            });
        });

        socket.on('addMma', function(fn)  {
            if(user === undefined){
                error("You must be logged in to join mma");
                return;
            }
            /* todo split add and trigger queue in two parts */
            Dispatcher.addQueue(user.id, function(e, r, triggered, players){
                if(e){
                    error(r);
                    fn(false);
                }
                else fn(true);
                if(triggered) createMatch(players);
            });
        });



        function createMatch(players){

            connected[players.p1].emit('gameFound');
            connected[players.p2].emit('gameFound');


            console.log("players : ");
            console.log(players);

            Dispatcher.addMatch([players.p1,players.p2],function(err,rep){
                if(err) error(rep);
                else match = rep;
            });
            match = players.p1+""+players.p2;

            timer.on('end',createMatchHandler);
            angle = 0.02;
            timer.start();
        }


        timer.on('ontick',function (millis) {
            console.log('ticked');
            angle += 0.02;
            Dispatcher.getUser(user.id,function (err,res){
                if(err) error(res);
                else{
                    Dispatcher.getMatch(res.match,function (err,mtch) {
                        console.log(mtch);
                        if(err) error(mtch);
                        else{
                            var time = (millis/1000).toFixed(1);
                            connected[mtch.p1].emit('gameFound_tick',{angle:angle,time:time});
                            connected[mtch.p2].emit('gameFound_tick',{angle:angle,time:time});
                        }
                    })
                }
            })

        });


        /*
        TODO : WAIT LA FIN DU TEMPS (go callback timer) POUR VOIR LE STATE DES JOUEURS ET UPDATE EN FONCTION
         */

        /*
        TODO : create global functions as setUsers or getUsers etc.... with array of ids in arg instead of a single one
         */

        socket.on('gameFound_answer', function(answer){
            console.log("game found answer");
            if(user === undefined){
                error("You must be logged in to join mma");
                return;
            }
            else if(match === undefined){
                error("You must be matched to join one");
                return;
            }
            else if(user.answertomatch != -1){
                error("You already "+ (user.answertomatch ? 'accepted' : 'declined') + " this match");
                return;
            }
            user.answertomatch = answer;
            Dispatcher.getMatch(match,function(err,mtch){
                var pn = user.id == mtch.p1 ? 'p1_answer' : 'p2_answer';
                Dispatcher.setMatch(match,pn,answer,function(err,rep){
                    if(err) error(rep);
                });
            });
        }); //true



        function createMatchHandler(){
            timer = undefined;
            console.log("createMatchHandler");
            // create a game or not deciding from users answers
            Dispatcher.getMatch(match,function (err,mtch) {
                if(err) error(mtch);
                else{
                    console.log(mtch);
                    switch(mtch.p1_answer && mtch.p2_answer){
                        case 0:
                            var props = {
                                match:0,
                                state: 'hall',
                                answertomatch: -1
                            }
                            Dispatcher.setUser(mtch.p1,props,function (err,rep) {
                                if(err) error(rep);
                                else{
                                    Dispatcher.setUser(mtch.p2,props,function (err,rep) {
                                        if(err) error(rep);
                                        else{
                                            connected[mtch.p1].emit('declined');
                                            connected[mtch.p2].emit('declined');
                                        }
                                    });
                                }
                            });

                            break;
                        case 1:
                            var props = {
                                match:mtch.p1+""+mtch.p2,
                                state: 'ingame',
                            }
                            Dispatcher.setUser(mtch.p1,props,function (err,rep) {
                                if(err) error(rep);
                                else{
                                    Dispatcher.setUser(mtch.p2,props,function (err,rep) {
                                        if(err) error(rep);
                                        else{
                                            connected[mtch.p1].emit('accepted');
                                            connected[mtch.p2].emit('accepted');
                                            createGame([mtch.p1,mtch.p2]);
                                        }
                                    });
                                }
                            });
                            break;
                    }
                }
            });
        }

        function createGame(ids){

        }



    });

}

module.exports = socketing;
