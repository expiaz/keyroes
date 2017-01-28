'use strict';
var dispatcher = require('./App');
var io = require('./Io');
var connected = io.sockets.connected;

io.on('connection', function(socket) {
    socket.on('k-register',function (username) {
        console.log("registering")
        dispatcher.register({sid:socket.id,username:username});
    });

    socket.on('disconnect',function () {
        dispatcher.disconnect(socket.id);
    });
});