'use strict';

var constants = require('./../shared/constants');
var Letter = require('./Letter');
var QueueManager = require('./../manager/QueueManager');
var ChatManager = require('./../manager/ChatManager');

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
        this.spectate;
        this.room = constants.room.IN_HALL;
        this.state = constants.state.IN_HALL;
        this.answertomatch = constants.match.NO_ANSWER;
    }

    getId(){
        return this.id;
    }

    getPublicId(){
        return this.token;
    }

    setSocket(socket){
        console.log('setSocket', typeof this.socket, typeof socket);
        let needReconciliation = false;
        if(this.socket !== void 0){
           console.log('deco');
           this.socket.disconnect(true);
           needReconciliation = true;
        }
        this.sid = socket.id;
        this.socket = socket;
        if(needReconciliation){
            this.reconcile();
        }
        console.log('co');
    }

    getSid(){
        return this.sid;
    }

    getSocket(){
        return this.socket;
    }

    getUsername(){
        return this.username;
    }

    setState(state){
        this.state = state;
    }

    enterChat(){
        ChatManager.addUser(this);
    }

    enterQueue(){
        this.state = constants.state.IN_QUEUE;
        QueueManager.add(this);
    }

    leaveQueue(){
        this.state = constants.state.HALL;
        QueueManager.remove(this);
    }

    enterMatch(match){
        this.game = null;
        this.spectate = null;
        this.match = match;
        this.state = constants.state.IN_MATCH;
    }

    abortMatch(){
        this.match = null;
        this.state = constants.state.IN_HALL;
    }

    getMatch(){
        return this.match;
    }

    enterGame(game){
        this.game = game;
        this.match = null;
        this.spectate = null;
        ChatManager.removeUser(this);
        this.socket.join(game.getPublicId());
        this.state = constants.state.IN_GAME;
    }

    leaveGame(game){
        this.game = null;
        this.match = null;
        ChatManager.addUser(this);
        this.state = constants.state.IN_HALL;
    }

    enterSpectate(game){
        this.socket.leave(constants.room.HALL);
        this.match = null;
        this.game = null;
        this.spectate = game;
        this.socket.join(game.getPublicId());
        this.state = constants.game.IN_SPECTATE;
    }

    leaveSpectate(game){
        this.spectate = null;
        this.match = null;
        this.socket.leave(game.getPublicId());
        this.socket.join(constants.room.HALL);
        this.state = constants.state.IN_HALL;
    }

    getGame(){
        return this.game;
    }

    setAnswer(answer){
        if(this.match == null) return;
        this.answertomatch = answer;
        this.match.updatePlayerCounter(answer);
    }

    getAnswer(){
        return this.answertomatch;
    }

    send(content){
        this.socket.emit(constants.server.MESSAGE, content);
    }

    sendMessage(content){
        if(content.length > 50)
            return;
        ChatManager.send(this, content);
    }

    /**
     * Socket bindings
     */
    onKeypress(letterCode){
        this.game && Letter.isValid(letterCode) && this.game.handleKeypress(this, letterCode);
    }

    reconcile(){
        switch(this.state){
            case constants.state.IN_HALL:
                // TODO ChatController.userDisconnect(this.username);
                //TODO UserManager.remove(this.sid);
                break;
            case constants.state.IN_MATCH:
                break;
            case constants.state.IN_GAME:
                break;
            case constants.state.IN_SPECTATE:
                break;
        }
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