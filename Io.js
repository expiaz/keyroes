var socketio = require('socket.io');
var server = require('./Server');
var middleware = require('./mid');

var io = socketio.listen(server);
io.use(middleware.socketio);

module.exports = io;