'use strict';

var Map = require('../shared/Map');

class UserRepository{

    constructor(){
        this.users = new Map();;
    }

    init(){

    }

    add(hash, user){
        this.users.add(hash, user);
    }

    exists(hash){
        this.users.exists(hash);
    }

    get(hash){
        return this.users.get(hash);
    }

    remove(hash){
        this.users.remove(hash);
    }

}

module.exports = new UserRepository();