var session = require('express-session');

var sessionMiddleware = session({
    secret: 'keyboard cat',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 }
});

module.exports = sessionMiddleware;