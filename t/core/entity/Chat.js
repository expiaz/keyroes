'use strict';

var Map = require('./../shared/Map');
var cst = require('./../shared/constants');
var Io = require('./../shared/Io');

class Chat{

    constructor(id){
        this.id = id;
        this.users = new Map();
        this.messages = [];
        this.socketPool = Io.getInstance();
    }

    send(user, message){
        let u = this.users.get(user.getPublicId());
        if(u === void 0)
            return;
        let msg = {
            type: cst.chat.USER_MESSAGE,
            username: u.getUsername(),
            message: message,
            time: new Date().getHours() + " : " + new Date().getMinutes()
        };
        this.messages.push(msg);
        this.socketPool.to(this.id).send(cst.chat.RECEIVE_MESSAGE, msg);
    }

    sendEveryMessageTo(user){
        user.getSocket().emit(cst.chat.MAJ_MESSAGES, this.messages);
    }

    addUser(user){
        this.users.add(user.getPublicId(), user);
        user.getSocket().join(this.id);
        let m = {
            type: cst.chat.SERVER_MESSAGE,
            username: user.getUsername(),
            message: user.getUsername() + " joined the room",
            time: new Date().getHours() + " : " + new Date().getMinutes()
        }
        this.sendEveryMessageTo(user);
        this.messages.push(m);
        this.socketPool.to(this.id).emit(cst.chat.RECEIVE_MESSAGE, m);
    }

    removeUser(user){
        this.users.remove(user.getPublicId());
        user.getSocket().leave(this.id);
        let m = {
            type: cst.chat.SERVER_MESSAGE,
            username: user.getUsername(),
            message: user.getUsername() + " leaved the room",
            time: new Date().getHours() + " : " + new Date().getMinutes()
        }
        this.messages.push(m);
        this.socketPool.to(this.id).send(cst.chat.RECEIVE_MESSAGE, m);
    }

}

module.exports = Chat;