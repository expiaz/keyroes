'use strict';
var io = require('./Io');
var connected = io.sockets.connected;
var userController = require('./controllers/UserController');

class Dispatcher{
    constructor(){

    }

    register(user){
        userController.register(user);
    }

    disconnect(sid){
        userController.disconnect(sid);
    }

}

module.exports = new Dispatcher();