var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var session = require('express-session');
var bodyParser = require('body-parser');
var tpl_engine = require('../chino/chino');
var chino = new tpl_engine();

chino.register('auth.chino');

var middleware = session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }});

server.listen(3000);

//bodyParser
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));


// Use the session middleware
app.use(middleware);

app.post('/auth',function (req,res) {

    if(req.session.login) return res.json({success:true,message:'connected as '+req.session.login})

    var login = req.body.login,
        pwd = req.body.password;

    console.log(req.body);

    if(!login || !pwd) return res.json({success:false,message:'no credentials'})
    else if(login != 'az' || pwd != 'az') return res.json({success:false,message:'bad credentials'})
    else{
        req.session.login = login;
        return res.json({success:true,message:'connected as '+req.session.login});
    }


});

app.use(function (req,res,next) {
    if(req.session.login) return next();
    return res.send(chino.render('auth'));
});

// Access the session as req.session
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html')
    res.end(chino.render('index.chino'));
});

io.use(function(socket, next) {
    middleware(socket.request, socket.request.res, next);
});

io.on('connection', function (socket) {
    console.log('socket log');
    console.log(socket.request.session.login);
    console.log(' ');

    socket.on('trigger', function () {
        console.log('socket trigger');
        console.log(socket.request.session.login);
        socket.request.session.click = ++socket.request.session.click || 1;
        console.log(socket.request.session.click);
        socket.emit('click',socket.request.session.click);
        console.log(' ');
    });
});