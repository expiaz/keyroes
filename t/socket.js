var app = require('./server');
var io = require('socket.io')(app);
var session = require('./session');

var socketEvents = require('./constants').socketEvent;

//base middleware socketio
io.use(function(socket, next) {
    session(socket.request, socket.request.res, next);
});

//bind events
io.on('connection', function (socket) {
    console.log('Socket connecting');
    if(typeof socket.request.session.keyroesToken !== "string") socket.disconnect(true);
    console.log('Socket connected');
    /*var User = UserManager.get(socket.request.session.keyroesToken);
    socket.on(socketEvents.KEYPRESS, User.bind);
    socket.on('disconnect', User.disconnect);*/
});

module.exports = io;