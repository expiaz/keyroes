'use strict';

var Map = require('../shared/Map');

class UserRepository{

    constructor(){
        this.users = new Map();
    }

    add(login, user){
        this.users.add(login, user);
    }

    exists(login){
        this.users.exists(login);
    }

    get(login){
        return this.users.get(login);
    }

    remove(login){
        this.users.remove(login);
    }

}

module.exports = new UserRepository();