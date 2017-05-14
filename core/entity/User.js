'use strict';

var constants = require('./../shared/constants');
var Letter = require('./Letter');
var QueueManager = require('./../manager/QueueManager');
var ChatManager = require('./../manager/ChatManager');
var GameManager = require('./../manager/GameManager');

var UserRepository = require('./../repository/UserRepository');

class User{

    constructor(id, ip, hash, username){
        this.id = id;
        this.sid;
        this.socket = null;
        this.ip = ip;
        this.username = username;
        this.token = hash;
        this.match = null;
        this.game = null;
        this.spectate = null;
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
        console.log('User::setSocket', this.socket !== null, typeof socket);
        let needReconciliation = false;
        if(this.socket !== null){
           console.log('setSocket reconciling');
           let s = this.socket;
           this.socket = null;
           s.disconnect(true);
           needReconciliation = true;
        }
        this.sid = socket.id;
        this.socket = socket;
        if(needReconciliation){
            this.reconcile();
        }
        else{
            this.connect();
        }
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

    leaveChat(){
        ChatManager.removeUser(this);
    }

    enterQueue(){
        console.log(this.getPublicId() + ' enterQueue');
        this.state = constants.state.IN_QUEUE;
        QueueManager.add(this);
    }

    leaveQueue(){
        console.log(this.getPublicId() + ' leaveQueue');
        this.state = constants.state.HALL;
        QueueManager.remove(this);
    }

    enterMatch(match){
        this.game = null;
        this.spectate = null;
        this.match = match;
        this.state = constants.state.IN_MATCH;
        this.socket.join(match.getPublicId());
        this.socket.emit(constants.match.ENTER_MATCH);
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
        this.socket.leave(game.getPublicId());
        ChatManager.addUser(this);
        this.state = constants.state.IN_HALL;
        this.synchronize();
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
        this.reconcile();
    }

    getGame(){
        return this.game;
    }

    setAnswer(answer){
        if(this.match === null) return;
        this.answertomatch = answer;
        this.match.updatePlayerCounter(answer);
    }

    getAnswer(){
        return this.answertomatch;
    }

    send(content){
        this.socket.emit(constants.chat.SERVER_MESSAGE, content);
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
        if(this.game !== null)
            return;
        if(!Letter.isValid(letterCode))
            return;
        this.game.handleKeypress(this, letterCode);
    }

    reconcile(){
        switch(this.state){
            case constants.state.IN_HALL:
                ChatManager.reconcile(this);
                break;
            case constants.state.IN_QUEUE:
                ChatManager.reconcile(this);
                QueueManager.reconcile(this);
                break;
            case constants.state.IN_MATCH:
                ChatManager.reconcile(this);
                this.match.reconcile(this);
                break;
            case constants.state.IN_GAME:
                this.game.reconcile(this);
                break;
            case constants.state.IN_SPECTATE:
                this.spectate.reconcile(this);
                break;
        }
        this.synchronize();
    }

    getActualState(){
        let actualState = {
            state: this.state
        };

        switch (this.state){
            case constants.state.IN_HALL:
                actualState.chat = ChatManager.getActualState();
                actualState.games = GameManager.getActualState();
                break;
            case constants.state.IN_QUEUE:
                actualState.chat = ChatManager.getActualState();
                actualState.games = GameManager.getActualState();

                actualState.queue = QueueManager.getActualState(this);
                break;
            case constants.state.IN_MATCH:
                actualState.chat = ChatManager.getActualState();
                actualState.games = GameManager.getActualState();

                actualState.match = Object.assign({}, {answer: this.answertomatch}, this.match.getActualState());
                break;

            case constants.state.IN_GAME:
                actualState.game = this.game.getActualState();
                break;
            case constants.state.IN_SPECTATE:
                actualState.spectate = this.spectate.getActualState();
                break;
        }

        return actualState;
    }

    synchronize(){
        console.log('User::sync');

        this.socket.emit(constants.user.SYNCHRONIZE, this.getActualState());
    }

    connect(){
        console.log('User::connect');
        this.enterChat();
    }

    disconnect(){
        if(this.socket === null)
            return;
        console.log('User::disconnect');

        switch(this.state){
            case constants.state.IN_HALL:
                ChatManager.removeUser(this);
                break;
            case constants.state.IN_QUEUE:
                ChatManager.removeUser(this);
                QueueManager.remove(this);
                break;
            case constants.state.IN_MATCH:
                ChatManager.removeUser(this);
                this.match.userLeave(this);
                break;
            case constants.state.IN_GAME:
                this.game.userLeave(this);
                break;
            case constants.state.IN_SPECTATE:
                this.spectate.removeSpectator(this);
                break;
        }
        UserRepository.remove(this.getPublicId());
    }
}

module.exports = User;