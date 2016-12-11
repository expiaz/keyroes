var express = require('express');
var app = express();
var http = require('http').Server(app);
var socketio = require('socket.io');
var path = require('path');

var io = socketio.listen(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/sample.html');
});
var sockets;
io.on('connection', function(socket) {
    sockets = io.sockets.connected;
});
module.exports.sockets = sockets;

http.listen(3000);
