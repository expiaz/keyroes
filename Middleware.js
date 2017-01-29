'use strict';
var jwt = require('jsonwebtoken');
var constants = require('./utils/constants');

class Middleware{

    socketio(socket,next){
        var req = socket.handshake;
        if(UserManager.get(req.ip) == -1)
        next();
    }

    express(req,res,next){
        var user = UserManager.get(req.ip);
        if(user == -1) return res.sendFile(__dirname + '/auth.html');
        next();
    }

    api(res,req,next){
        var user = UserManager.get(req.ip);
        if(user == -1) return res.sendFile(__dirname + '/auth.html');
        if(user.token == req.body.token || req.query.token || req.headers['x-access-token']) next();
        else return res.sendFile(__dirname + '/auth.html');

        /*UserModel.getUser({ip:req.ip,token:req.body.token || req.query.token || req.headers['x-access-token']},function (err,user) {
            if(!user) return res.json({success:false,message:'bad token'});
            next();
        });*/

    }

}

module.exports = new Middleware();