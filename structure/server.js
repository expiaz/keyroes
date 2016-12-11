var express = require('express');
var path = require('path');
var socket = require('./Socket');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var server = app.listen(2785);

socket(server);