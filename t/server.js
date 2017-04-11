var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var session = require('./core/shared/session');
var Auth = require('./core/Auth');
var Chino = require('../chino/chino');

var UserRepository = require('./core/repository/UserRepository');
var User = require('./core/entity/User');

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
    var authenticated;

    if(req.session.keyroesToken) {
        console.log('already auth token : ', req.session.keyroesToken);
        authenticated = Auth.validateToken(req.session.keyroesToken);
    }
    else{
        console.log('authenticating with ', req.body.login, req.body.password);
        authenticated = Auth.authenticate(req.body.login, req.body.password);
    }


    if(authenticated) {
        console.log('Auth ok');
        req.session.keyroesToken = Auth.getToken(req.body.login);
        req.session.username = req.body.login;
        UserRepository.add(req.body.login,  new User(1, req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.session.keyroesToken, req.body.login));
        return res.redirect('/');
    }
    else{
        console.log('Auth bad');
        res.set('Content-type', 'text/html');
        return res.end(chino.render('auth', {error: true, message: 'bad credentials'}));
    }

});

//base middlware
app.use(function (req,res,next) {
    console.log('base middleware token ', req.session.keyroesToken);
    if(typeof req.session.keyroesToken == "string") return next();
    return res.redirect('/auth');
});

// Access the session as req.session
app.get('/', function(req, res) {
    //res.setHeader('Content-Type', 'text/html');
    console.log('get /');
    res.sendFile(path.join(__dirname, 'index.html'));
});

var server = app.listen(3000, function (err) {
    if(err) throw err;
    console.log('Server listening');
});

module.exports = server;