var app = require('./server');
var io = require('socket.io')(app);
var session = require('./core/shared/session');

var Io = require('./core/shared/Io.js');
var events = require('./core/shared/constants');
var User = require('./core/entity/User');
var Auth = require('./core/Auth');


var GameFactory = require('./core/factory/GameFactory');
var LetterFactory = require('./core/factory/LetterFactory');
var MatchFactory = require('./core/factory/MatchFactory');

var ChatManager = require('./core/manager/ChatManager');
var GameManager = require('./core/manager/GameManager');

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
GameManager.init();

//bind events
io.on('connection', function (socket) {

    socket.removeListener;

    console.log('Socket connecting');

    if(typeof socket.request.session.keyroesToken !== "string")
        return socket.disconnect(true);

    if(!Auth.validateToken(socket.request.session.keyroesToken))
        return socket.disconnect(true);

    var user = null;

    if(UserRepository.exists(socket.request.session.keyroesToken)){
        user = UserRepository.get(socket.request.session.keyroesToken);
    }
    else{
        user = new User(socket.request.session.keyroesId, socket.request.session.keyroesIp, socket.request.session.keyroesToken, socket.request.session.keyroesUsername);
        UserRepository.add(user.getPublicId(), user);
    }

    user.setSocket(socket);

    console.log('socket connected');

    /*
    SYNC
     */
    socket.on(events.user.NEED_SYNC, user.synchronize.bind(user));

    /*
    CHAT
     */
    socket.on(events.user.SEND_MESSAGE, user.sendMessage.bind(user));

    /*
    QUEUE
     */
    socket.on(events.queue.ENTER_QUEUE, user.enterQueue.bind(user));
    socket.on(events.queue.LEAVE_QUEUE, user.leaveQueue.bind(user));

    //TODO: RECONCILE EVENT => send the actual state to update the front

    /*
    MATCH
     */
    socket.on(events.match.ACCEPT_MATCH, function () {
        this.setAnswer(events.match.ACCEPT_MATCH);
    }.bind(user));
    socket.on(events.match.DECLINE_MATCH, function () {
        this.setAnswer(events.match.DECLINE_MATCH)
    }.bind(user));

    /*
    GAME
     */
    socket.on(events.user.KEYPRESS, user.onKeypress.bind(user));

    /*
    DC
     */
    socket.on('disconnect', user.disconnect.bind(user));

});
