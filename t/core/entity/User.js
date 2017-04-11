'use strict';

var constants = require('./../shared/constants');

class User{

    constructor(id, ip, hash, username){
        this.id = id;
        this.sid;
        this.socket;
        this.ip = ip;
        this.username = username;
        this.token = hash;
        this.match;
        this.game;
        this.room = constants.room.IN_HALL;
        this.state = constants.state.IN_HALL;
        this.answertomatch = constants.match.NO_ANSWER;
    }

    getPublicId(){
        return this.token;
    }

    setSocket(socket){
        if(this.socket !== void 0)
            this.socket.disconnect(true);
        this.sid = socket.id;
        this.socket = socket;
        console.log('co');
    }

    getSid(){
        return this.sid;
    }

    getSocket(){
        return this.socket;
    }

    enterMatch(match){
        this.match = match;
        this.state = constants.match.IN_MATCH;
    }

    getMatch(){
        return this.match;
    }

    enterGame(game){
        this.game = game;
        this.state = constants.game.IN_GAME;
    }

    getGame(){
        return this.game;
    }

    send(content){
        this.socket.emit('message', content);
    }

    sayHello(){
        this.socket.emit('hello', this.username);
    }

    /**
     * Socket bindings
     */
    onKeypress(letter){
        this.game && this.game.handleKeypress(this.token, letter);
    }

    disconnect(){
        console.log('dc');
        /*
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
        */
    }
}

module.exports = User;