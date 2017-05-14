'use strict';

var constants = require('../shared/constants');
var Map = require('../shared/Map');
var UserRepo = require('./../repository/UserRepository');

class GameManager{

    constructor(){
        this.games = new Map();
        this.socketPool = null;
    }

    init(){

    }

    add(game){
        this.games.add(game.getPublicId(), game);
        UserRepo.sync();
    }

    remove(game){
        if(typeof game === "string"){
           this.games.remove(game);
        }
        else
            this.games.remove(game.getPublicId());
        return UserRepo.sync();
    }

    get(game){
        if(typeof game === "string"){
            return this.games.get(game);
        }
        return this.games.get(game.getPublicId());
    }

    getGames(){
        return this.games.getValues();
    }

    getActualState(){
        return this.games.getValues().map(function (game) {
            let actualGameState = game.getActualState();
            return {
                players: actualGameState.scores,
                id: actualGameState.id
            }
        })
    }

}

module.exports = new GameManager();