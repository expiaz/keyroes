var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var path = require('path');
var bodyParser = require('body-parser');

var session = require('./core/shared/session');
var Auth = require('./core/Auth');
var Chino = require('./chino/chino');

chino = new Chino();
chino.register(__dirname + '/templates/auth.chino', 'auth');


//bodyParser
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

//static files
app.use(express.static(path.join(__dirname, 'public')));

// Use the session middleware
app.use(session);




app.get('/auth', function (req,res) {
    console.log('get auth');
    res.set('Content-type', 'text/html');
    var auth = chino.render('auth', {error:false});
    return res.end(auth);
});

app.post('/auth', function (req,res) {

    if(req.session.keyroesToken) {
        console.log('already auth token : ', req.session.keyroesToken);
        if(Auth.validateToken(req.session.keyroesToken)){
            console.log('Auth ok');
            return res.redirect('/');
        }
        else{
            console.log('Auth bad');
            res.set('Content-type', 'text/html');
            return res.end(chino.render('auth', {error: true, message: 'bad credentials'}));
        }
    }
    else{
        console.log('authenticating with ', req.body.login, req.body.password);
        Auth.authenticate(req.body.login, req.body.password)
            .done(function (user) {
                if(user.id > 0){
                    console.log('Auth ok');
                    req.session.keyroesId = user.id;
                    req.session.keyroesToken = Auth.getToken(req.body.login);
                    req.session.keyroesUsername = user.username;
                    req.session.keyroesIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.session.keyroesToken;
                    return res.redirect('/');
                }
                else{
                    console.log('Auth bad');
                    res.set('Content-type', 'text/html');
                    return res.end(chino.render('auth', {error: true, message: 'bad credentials'}));
                }
            })
    }


});

//base middlware
app.use(function (req,res,next) {
    console.log(req.url)
    console.log('base middleware token ', req.session.keyroesToken, typeof req.session.keyroesToken);
    if(typeof req.session.keyroesToken == "string") return next();
    return res.redirect('/auth');
});

// Access the session as req.session
app.get('/', function(req, res) {
    //res.setHeader('Content-Type', 'text/html');
    console.log('get /');
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(3000, function (err) {
    if(err) throw err;
    console.log('Server listening');
});

module.exports = server;