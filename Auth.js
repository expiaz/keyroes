var jwt = require('jsonwebtoken');
var constants = require('./utils/constants');
var model = require('./model/UserModel');

class Auth{

    authUser(req,res){
        var login = req.body.login || req.query.login,
            pwd = req.body.password || req.query.password,
            action = req.body.action || req.query.action,
            self = this;

        if(!login || !pwd)
            return res.redirect('/auth');


        UserModel.getUser({login:login,password:pwd},function(err,user){
            if(login != user.login || pwd != user.password)
                return self.res.json({success:false, message:'bad credentials'});
            UserModel.setUser({ip:req.ip});
            self.res.sendFile(__dirname + '/index.html');
        });

    }

}

module.exports = new Auth();