'use strict';
var io = require('./Io');
var connected = io.sockets.connected;
var UserManager = require('./Manager/UserManager');

class Dispatcher{
    constructor(){

    }

    register(user){
        UserManager.register(user);
    }

    disconnect(sid){
        UserManager.disconnect(sid);
    }

}

module.exports = new Dispatcher();