'use strict';

var UserManager = require('./../Manager/UserManager');
var Chat = require('../class/Chat');
var UserClass = require('./../class/User');
var state = require('./../utils/constants').User.State;
var io = require('../Io');
var connected = io.sockets.connected;

class UserController{
    constructor(){}

    register(user){
        if(UserManager.exists(user.sid)) return connected[user.sid].emit('k-already-connected');
        if(!UserManager.checkUsername(user.username)) return connected[user.sid].emit('k-name-taken');
        var u = new UserClass(user.sid,user.username);
        UserManager.add(u);
        Chat.addUser(user.sid);
        return u;
    }

    disconnect(sid){
        if(!UserManager.exists(sid)) throw new Error("[UserController:disconnect:"+sid+"] Can't DC a user that doesn't exists");
        UserManager.get(sid).disconnect();
    }
}

module.exports = new UserController();