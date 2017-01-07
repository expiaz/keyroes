'use strict';

var constants = require('../utils/constants').Chat;
var io = require('../Io');
var connected = io.sockets.connected;
var UserManager = require('../Manager/UserManager');

class Chat{
    constructor(){
        this.messages = [];
        this.users = [];
    }

    addUser(sid){
        this.users.push(UserManager.get(sid).username);
        this.sendGreetMessage(sid);
    }

    removeUser(sid){
        this.users.splice(this.users.indexOf(UserManager.get(sid).username),1);
        this.sendByeMessage(sid);
    }

    sendMessage(sid,message,room){
        if(message.length > 50) return connected[sid].emit('k-message-length');
        var user = UserManager.get(sid);
        room = room || user.room || constants.Room.HALL;
        var msg = {
            username:user.username,
            message: message,
            time:this.getTimestamp(),
            type: constants.Type.USER
        };
        this.messages.push(msg);
        io.to(room).emit('k-message',msg);
    }

    sendGreetMessage(sid,room){
        var user = UserManager.get(sid);
        room = room || user.room || constants.Room.HALL;
        var msg = {
            username:user.username,
            message: constants.Message.GREET.replace("{{username}}",user.username),
            time:this.getTimestamp(),
            type: constants.Type.SERVER
        };
        this.messages.push(msg);
        io.to(room).emit('k-message',msg);
    }

    sendByeMessage(sid,room){
        var user = UserManager.get(sid);
        room = room || user.room || constants.Room.HALL;
        var msg = {
            username:user.username,
            message: constants.Message.BYE.replace("{{username}}",user.username),
            time:this.getTimestamp(),
            type: constants.Type.SERVER
        };
        this.messages.push(msg);
        io.to(room).emit('k-message',msg);
    }

    sendGoesGameMessage(sid,room){
        var user = UserManager.get(sid);
        room = room || user.room || constants.Room.HALL;
        var msg = {
            username:user.username,
            message: constants.Message.GAME.replace("{{username}}",user.username),
            time:this.getTimestamp(),
            type: constants.Type.SERVER
        };
        this.messages.push(msg);
        io.to(room).emit('k-message',msg);
    }

    sendMessages(room){
        return io.to(room).emit('k-all-messages',this.messages);
    }

    getMessages(room){
        return this.messages;
    }

    getUsers(){
        return this.users;
    }

    getTimestamp(){
        return new Date().getHours() + ":" + new Date().getMinutes();
    }
}

module.exports = new Chat();