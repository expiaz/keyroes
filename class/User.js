'use strict';


var io = require('../Io');
var sockets = io.sockets.connected;
var baseconstants = require('../utils/constants');
var constants = baseconstants.User;

class User{
    constructor(sid,username){
        this.id;
        this.sid = sid;
        this.ip;
        this.username = username;
        this.match = null;
        this.room = baseconstants.Chat.Room.HALL;
        this.game = null;
        this.state = constants.State.IN_HALL;
        this.answertomatch = constants.Answer.BASE;
    }

    send(content){
        sockets[this.sid].emit('message', content);
    }

    disconnect(){
        switch(this.state){
            case constants.State.IN_HALL:
                // TODO ChatController.userDisconnect(this.username);
                //TODO UserManager.remove(this.sid);
                break;
            case constants.State.IN_MATCH:
                break;
            case constants.State.IN_GAME:
                break;
            case constants.State.IN_SPECTATE:
                break;
        }
    }
}

module.exports = User;