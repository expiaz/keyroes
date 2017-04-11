var socketio = require('socket.io');
var server = require('./Server');
var middleware = require('./Middleware');

var io = socketio.listen(server);
io.use(middleware.socketio);

module.exports = io;