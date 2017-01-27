var jwt = require('jsonwebtoken');
var express = require('express');

var app = require('./../Setup');
var router = express.Router();

router.post('/auth', function (req,res) {

    var user = {
        login: 'az',
        password: 'az'
    };

    if(user.login != req.body.login || user.password != req.body.password)
        return res.json({
            success: false,
            message: 'Auth failed, bad credentials'
        });

    var token = jwt.sign(req.body.login, app.get('hash'));

    return res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
    });

});

//middleware
router.use(function (req,res,next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token, req.app.settings.hash, function(err, decoded) {
            if (err)
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else
        return res.status(401).json({
            success: false,
            message: 'No token provided.'
        });

});

router.get('/', function(req, res) {
    res.json({ message: 'Keyroes API' });
});

app.use('/api',router);

module.exports = app;