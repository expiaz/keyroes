var express = require('express');
var bodyParser = require('body-parser');
var router = require('./Router');
var middleware = require('./mid');
var auth = require('./Auth');

var app = express();

//static assets
app.use(express.static(__dirname + '/public'));

//bodyParser
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

//auth
app.post('/auth',auth.authUser);

//middleware
app.use(middleware.express);

//routing api
//app.use('/api',router);

//base page
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


var server = app.listen(3000,function () {
    console.log("[EXPRESS] listenning on port 3000")
});

module.exports = server;