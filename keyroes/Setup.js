var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//static assets
app.use(express.static('../public'));

//secret for jwt
app.set('hash','myOwn');

//bodyParser
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

//base page
app.get('/', function(req, res){
    res.sendFile(__dirname + '/sample.html');
});

module.exports = app;