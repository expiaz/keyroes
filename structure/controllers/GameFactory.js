'use strict';

var manager = require('./../Manager/GameManager');
var game = require('./../class/Game');
var clock = require('timer.js');

class GameFactory{
    constructor(){

    }

    create(id,p1,p2){
        var g = new game(id,p1,p2);
        manager.add(g);
        return g;
    }
}

module.exports = new GameFactory();