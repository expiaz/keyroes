var express = require('express');
var bodyParser = require('body-parser');
var router = require('./Router');
var middleware = require('./Middleware');
var auth = require('./Auth');

var app = express();
var serv = require('http').Server(app);


//static assets
app.use(express.static(__dirname + '/public'));

//bodyParser
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

//auth
app.post('/auth',auth.authUser);

//middleware api
app.use('/api',middleware.api);

//middleware
app.use(middleware.express);



//base page
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


var server = app.listen(3000,function () {
    console.log("[EXPRESS] listenning on port 3000")
});

module.exports = server;