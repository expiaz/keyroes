'use strict';

var Chat = require('./../entity/Chat');
var cst = require('./../shared/constants');

class ChatManager{

    constructor(){
        this.chat = null;
    }

    init(){
       this.chat = new Chat(cst.room.HALL)
    }

    send(player, message){
        this.chat.send(player, message);
    }

    addUser(player){
        this.chat.addUser(player);
    }

    removeUser(player){
        this.chat.removeUser(player);
    }

    sendAll(user){
        this.chat.sendEveryMessageTo(user);
    }

    reconcile(user){
        this.chat.reconcile(user);
    }

}

module.exports = new ChatManager();