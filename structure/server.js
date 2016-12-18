var express = require('express');
var socket = require('./Socket');

var app = express();

app.use(express.static('../public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var server = app.listen(3000,function () {
    console.log("[EXPRESS] listenning on port 3000")
});

socket(server);