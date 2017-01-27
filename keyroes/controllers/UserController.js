'use strict';

var userManager = require('./../Manager/userManager');
var chat = require('../class/Chat');
var userClass = require('./../class/User');
var state = require('./../utils/constants').User.State;
var io = require('../Io');
var connected = io.sockets.connected;

class UserController{
    constructor(){}

    register(user){
        if(userManager.exists(user.sid)) return connected[user.sid].emit('k-already-connected');
        if(!userManager.checkUsername(user.username)) return connected[user.sid].emit('k-name-taken');
        var u = new userClass(user.sid,user.username);
        userManager.add(u);
        chat.addUser(user.sid);
        return u;
    }

    disconnect(sid){
        if(!userManager.exists(sid)) return console.log("[UserController:disconnect:"+sid+"] User wasn't logged");
        userManager.remove(sid).disconnect();
    }
}

module.exports = new UserController();