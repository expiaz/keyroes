'use strict';

var Map = require('../shared/Map');

class GameRepository{

    constructor(){
        this.games = new Map();
    }

    add(gameId, game){
        this.games.add(gameId, game);
    }

    exists(gameId){
        this.games.exists(gameId);
    }

    get(gameId){
        return this.games.get(gameId);
    }

    remove(gameId){
        this.games.remove(gameId);
    }

}

module.exports = new GameRepository();