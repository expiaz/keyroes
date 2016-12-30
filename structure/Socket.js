'use strict';
var dispatcher = require('./App');
var io = require('./io');
var connected = io.sockets.connected;

io.on('connection', function(socket) {
    socket.on('messageSent',function (msg) {
        dispatcher.messageSentHandler(socket.id,msg);
    })
});