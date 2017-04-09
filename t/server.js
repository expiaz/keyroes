var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var session = require('./session');

var Auth = require('./Auth');
var Chino = require('./../chino/chino');
chino = new Chino();
chino.register('auth.chino');

//bodyParser
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

//static files
app.use(express.static(__dirname + '/public'));

// Use the session middleware
app.use(session);

app.get('/auth', function (req,res) {
    res.set('Content-type', 'text/html');
    return res.end(chino.render('auth', {error:false}));
});

app.post('/auth', function (req,res) {

    var authenticated;

    if(req.session.keyroesToken)
        authenticated = Auth.validateToken(req.session.keyroesToken)
    else
        authenticated = Auth.authenticate(req.body.login, req.body.password);

    if(authenticated) {
        console.log('Auth ok');
        req.session.keyroesToken = Auth.getToken(req.body.login);
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
    if(req.session.keyroesToken) return next();
    return res.redirect('/auth');
});

// Access the session as req.session
app.get('/', function(req, res) {
    //res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname + '/index.html');
});

var server = app.listen(3000, function (err) {
    if(err) throw err;
    console.log('Server listening');
});

module.exports = server;