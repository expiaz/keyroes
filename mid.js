'use strict';
var jwt = require('jsonwebtoken');
var constants = require('./utils/constants');

class Middleware{

    socketio(socket,next){
        var req = socket.handshake;
        console.log(req);
        next();
    }

    express(req,res,next){
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if(token){
            jwt.verify(token, constants.Router.HASH, function(err, decoded) {
                if (err)
                    return res.sendFile(__dirname + '/auth.html');
                else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else
            return res.sendFile(__dirname + '/auth.html');
    }
}

module.exports = new Middleware();