'use strict';
var sockets = require('../Io').sockets.connected;
var constants = require('../utils/constants').User;

class User{
    constructor(sid,username){
        this.id;
        this.sid = sid;
        this.username = username;
        this.match = 0;
        this.game = 0;
        this.state = constants.State.IN_HALL;
        this.answertomatch = constants.Answer.BASE;
    }

    send(content){
        sockets[this.sid].emit('message',content);
    }

    disconnect(){
        switch(this.state){
            case constants.State.IN_HALL:
                // TODO ChatController.UserDisconnect(this.username);
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