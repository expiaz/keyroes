var app = require('./server');
var io = require('socket.io')(app);
var session = require('./core/shared/session');

var Io = require('./core/shared/Io.js');
var events = require('./core/shared/constants');
var User = require('./core/entity/User');


var GameFactory = require('./core/factory/GameFactory');
var LetterFactory = require('./core/factory/LetterFactory');
var MatchFactory = require('./core/factory/MatchFactory');

var ChatManager = require('./core/manager/ChatManager');
var QueueManager = require('./core/manager/QueueManager');

var GameRepository = require('./core/repository/GameRepository');
var UserRepository = require('./core/repository/UserRepository');

//base middleware socketio
io.use(function(socket, next) {
    session(socket.request, socket.request.res, next);
});


Io.setInstance(io);
GameFactory.init();
MatchFactory.init();
LetterFactory.init();
ChatManager.init();
QueueManager.init();

//bind events
io.on('connection', function (socket) {
    console.log('Socket connecting');

    if(typeof socket.request.session.keyroesToken !== "string")
        return socket.disconnect(true);


    var user = new User(1, socket.request.session.keyroesIp, socket.request.session.keyroesToken, socket.request.session.keyroesUsername);
    user.setSocket(socket);

    UserRepository.add(user.getPublicId(), user);

    console.log('socket connected');

    user.enterChat();

    socket.on(events.chat.SEND_MESSAGE, user.sendMessage);

    socket.on(events.queue.SUBSCRIBE, user.enterQueue);
    socket.on(events.queue.UNSUBSCRIBE, user.leaveQueue);

    socket.on(events.game.KEYPRESS, user.onKeypress);


    socket.on('disconnect', user.disconnect);
});
