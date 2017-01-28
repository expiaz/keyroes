'use strict';
var jwt = require('jsonwebtoken');
var constants = require('../utils/constants');

class Api{

    index(req, res) {
        res.json({ message: 'Keyroes API' });
    }

    authencitation(req,res){
        var user = {
            login: 'az',
            password: 'az'
        };

        if(user.login != req.body.login || user.password != req.body.password)
            return res.json({
                success: false,
                message: 'Auth failed, bad credentials'
            });

        var token = jwt.sign(req.body.login, constants.Router.HASH);

        return res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });
    }

}

module.exports = new Api();