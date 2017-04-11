'use strict';

var md5 = require('md5');
var Map = require('./shared/Map');
var UserRepository = require('./repository/UserRepository');
var User = require('./entity/User');

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

            if(UserRepository.get(login) instanceof User)
                return false;

            var hash = md5(login);
            this.tokens.add(login, hash);
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