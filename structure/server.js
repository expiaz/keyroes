var express = require('express');
var socketio = require('./socket');
var app = express();
//var http = require('http').Server(app);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/game', function(req, res){
    res.sendFile(__dirname + '/index_game.html');
});


var server = app.listen(2785);

socketio(server);