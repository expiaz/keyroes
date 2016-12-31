'use strict';
var io = require('./Io');
var connected = io.sockets.connected;


class Dispatcher{
    constructor(){

    }

    register(user){
        if(UserController.register(user))
            connected[user.sid].emit('registering',true);
    }
}

module.exports = new Dispatcher();