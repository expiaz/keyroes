'use strict';

var Map = require('../shared/Map');

class UserRepository{

    constructor(){
        this.users = new Map();
    }

    init(){

    }

    sync(){
        console.log("UserRepo syncing of ", this.users.getKeys().length);
        this.users.getKeys().forEach(function (id) {
            let user = this.users.get(id);
            user.synchronize();
        }.bind(this));
    }

    add(hash, user){
        this.users.add(hash, user);
    }

    exists(hash){
        return this.users.exists(hash);
    }

    get(hash){
        return this.users.get(hash);
    }

    remove(hash){
        this.users.remove(hash);
    }

}

module.exports = new UserRepository();