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




io.of('hall').on('connection', function(socket) {
    console.log("all");

var i = 0;
    var j = setInterval(function () {
        console.log(Object.keys(io.sockets.connected));
        console.log("id of all "+socket.id)
        console.log("real id "+socket.id.replace('/hall#',""))
        socket.emit('keepAlive','all')
        i++;
        if(i == 10 ){
            console.log("all dc "+socket.id)
            socket.disconnect();
            clearInterval(j);
        }
    },1000);

    socket.on('disconnect',function () {
        io.emit('dc','all');
    })
});

io.of('/game').on('connection', function(socket) {
    console.log("game");

    setInterval(function () {
        console.log("keepalive game")
        console.log("id of game "+socket.id)
        socket.emit('keepAlive','game')
    },1000);

    socket.on('disconnect',function () {
        io.to('/game').emit('dc','game');
    })
});

//console.log(io.sockets.connected);



http.listen(3000);
