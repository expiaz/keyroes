var socketio = require('socket.io');
var Dispatcher = require('./Dispatcher');

function socketing(server){
    var io = socketio.listen(server);

    io.on('connection', function(socket) {
        var user,
            connected = io.sockets.connected;

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

        socket.on('addMma', function(fn){
            if(user === undefined){
                error("You must be logged in to join mma");
                return;
            }
            Dispatcher.addQueue(user.id, function(e, r, triggered, players){
                if(e){
                    error(r);
                    fn(false);
                }
                else fn(true);
                if(triggered) createGame(players);
            });
        });

        function createGame(players){
            var p1 = connected[players.p1],
                p2 = connected[players.p2];

            p1.emit('gameFound',function(r){
                console.log("p1 answer : "+r);
            });
            p2.emit('gameFound',function(r){
                console.log("p2 answer : "+r);
            })
        }

        /*
        socket.on('addMma',function(fn){
            if(user === undefined){
                error("Please register before joining mma");
                return;
            }
            Dispatcher.addMma(user.id, function(state,msg){
                if(state){
                    error(msg);
                    fn(false);
                    return;
                }
                fn(true);
                matchFound(msg.p1,msg.p2);
            });
        });
        */

    });

}

module.exports = socketing;
