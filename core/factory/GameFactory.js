'use strict';

var Game = require('./../entity/Game');
var GameManager = require('../manager/GameManager');

class GameFactory{

    init(){

    }

    create(players){
        return new Game(players);
    }

}

module.exports = new GameFactory();