'use strict';

var constants = require('../shared/constants');
var Map = require('../shared/Map');

class GameManager{

    constructor(){
        this.games = new Map();
    }

    add(game){
        this.games.add(game.getPublicId(), game);
    }

    remove(game){
        if(typeof game === "string"){
            return this.games.remove(game);
        }
        return this.games.remove(game.getPublicId());
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

}

module.exports = new GameManager();