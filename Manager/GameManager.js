'use strict';

class GameManager{
    constructor(){
        this.games = [];
    }

    add(game){
        if(!this.games[game.id]) this.games[game.id] = game;
        else this.update(game);
    }

    update(game){
        if(this.games[game.id]) this.games[game.id] = game;
    }

    get(id){
        if(this.games[id]) return this.games[id];
    }

    delete(id){
        if(this.games[id]) this.games[id].destroy();
    }
}

module.exports = new GameManager();