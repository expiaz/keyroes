'use strict';

var md5 = require('md5');
var Map = require('./Map');
//var UserModel = require('./model/UserModel');

class Auth{

    constructor(){
        this.tokens = new Map();
    }

    authenticate(login, password){
        var exists = login == 'az' && password == 'az';

            /*UserModel.find({
            select: 'count (id)',
            where: 'login = :login AND password = :password'
        }, {
            login: login,
            password: md5(password)
        });*/

        if(exists){
            this.tokens.add(login, md5(login));
            return true;
        }
        return false;
    }

    validateToken(token){
        return this.tokens.contains(token);
    }

    getToken(login){
        return this.tokens.exists(login) ? this.tokens.get(login) : null;
    }

}


module.exports = new Auth();