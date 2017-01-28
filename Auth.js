var jwt = require('jsonwebtoken');
var constants = require('./utils/constants');

class Auth{

    authUser(req,res){
        var login = req.body.login || req.query.login,
            pwd = req.body.password || req.query.password,
            action = req.body.action || req.query.action;
        if(!login || !pwd)
            return res.redirect('/auth');
        if(login != "az" || pwd != "az")
            return action == 'login' ? res.json({success:false, message:'bad credentials'}) : res.redirect('/auth');
        var token = jwt.sign(login,constants.Router.HASH);

        res.json({success:true, token:token});
    }

}

module.exports = new Auth();