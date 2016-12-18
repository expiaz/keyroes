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

(function(){
    io.on('connection', function(socket) {
        SetState(socket);
    });

    var SetState = function(socket){
        console.log(io.sockets.connected);
        socket.emit("yo");
    }
})();



//console.log(io.sockets.connected);



http.listen(3000);
