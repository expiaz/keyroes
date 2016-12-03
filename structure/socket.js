var socketio = require('socket.io');


function init(server){
    var io = socketio.listen(server);

    var users = io.of('/').on('connection', function(socket){
        socket.emit('recevoir','here is your content');
        console.log('content sent');

        socket.on('update', function (data) {
            socket.emit('fn_update',data);
        });
    });

    var gamers = io.of('/game').on('connection', function(socket){
        socket.emit('recevoir','welcome to game');
        console.log('game sent');
    });
}

module.exports = init;
