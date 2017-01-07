var express = require('express');

var app = express();

app.use(express.static('../public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/sample.html');
});

var server = app.listen(3000,function () {
    console.log("[EXPRESS] listenning on port 3000")
});

module.exports = server;