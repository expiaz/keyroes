'use strict';
var dispatcher = require('./App');
var io = require('./Io');
var connected = io.sockets.connected;

io.on('connection', function(socket) {
    socket.on('register',function (username) {
        dispatcher.register({sid:socket.id,username:username});
    })
});