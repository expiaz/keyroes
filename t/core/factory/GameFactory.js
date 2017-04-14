'use strict';

var Game = require('./../entity/Game');

class GameFactory{

    init(){

    }

    create(players){
        return new Game(players);
    }

}

module.exports = new GameFactory();