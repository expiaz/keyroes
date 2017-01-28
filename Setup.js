var express = require('express');
var bodyParser = require('body-parser');
var router = require('./Router');

var app = express();

//static assets
app.use(express.static('../public'));

//bodyParser
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

//routing
app.use('/api',router);

//base page
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

module.exports = app;