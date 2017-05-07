'use strict';

var bcrypt = require('bcrypt');
var Map = require('./shared/Map');
var UserModel = require('./model/UserModel');


/*
var UserRepository = require('./repository/UserRepository');
var User = require('./entity/User');
*/

class Auth{

    constructor(){
        this.tokens = new Map();
    }

    authenticate(login, password){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        return UserModel.auth(login, password)
            .then(function (user) {
                if(user.id > 0){
                    if(this.tokens.contains(login))
                        return user;
                    this.tokens.add(login, hash);
                }
                return user;
            }.bind(this));
    }

    validateToken(token){
        return this.tokens.contains(token);
    }

    getToken(login){
        return this.tokens.exists(login) ? this.tokens.get(login) : null;
    }

}


module.exports = new Auth();