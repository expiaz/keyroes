'use strict';

var io = require('./Io');
var connected = io.sockets.connected;
var dispatcher = require('./App');
io.on('connection', function(socket) {
    socket.on('k-register',function (username) {
        console.log("registering")
        dispatcher.register({sid:socket.id,username:username});
    });

    socket.on('disconnect',function () {
        dispatcher.disconnect(socket.id);
    });
});