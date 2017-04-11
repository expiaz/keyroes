var app = require('./server');
var io = require('socket.io')(app);
var session = require('./core/shared/session');

var Io = require('./core/shared/Io.js');
var events = require('./core/shared/constants');
var UserRepository = require('./core/repository/UserRepository');
var User = require('./core/entity/User');



//base middleware socketio
io.use(function(socket, next) {
    session(socket.request, socket.request.res, next);
});



//bind events
io.on('connection', function (socket) {
    console.log('Socket connecting');

    if(typeof socket.request.session.keyroesToken !== "string")
        return socket.disconnect(true);

    var user = UserRepository.get(socket.request.session.username);

    if((user instanceof User) === false)
        return socket.disconnect(true);

    console.log('socket connected');

    user.setSocket(socket);
    user.sayHello();
    socket.on(events.game.KEYPRESS, user.onKeypress);
    socket.on('disconnect', user.disconnect);
});

Io.setInstance(io);