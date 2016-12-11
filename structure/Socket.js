var socketio = require('socket.io');
var Dispatcher = ('./Dispatcher');

function socketing(server){
    var io = socketio.listen(server);

    io.on('connection', function(socket) {
        var user;

        function error(err){
            console.log(err);
            socket.emit('error',err);
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
