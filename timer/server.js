var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var Timer = require('timer.js')
app.use(express.static(path.join(__dirname, 'vendor')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var myTimer = new Timer({
    tick: 0.1
});

io.on('connection', function(socket) {

    const time = 5;
    var angle = 0.02;

    socket.on('clck', function () {
        socket.emit('match', 5);
        myTimer.start(5);
        angle = 0;
    });

    myTimer.on('ontick', function (millis) {
        var t = (millis/1000).toFixed(1);
        angle += (1/50);
        socket.emit('tick', angle, {s: t});
    });




});

http.listen(3000);