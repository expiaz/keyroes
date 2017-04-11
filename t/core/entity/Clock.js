'use strict';

var Timer = require('timer.js');

class Clock{

    constructor(){
        this.timer = new Timer();
        this.binded;
    }

    bindGame(game){
        this.binded = game;
        this.timer.options({
            tick: game.options.timer.tick,
            ontick: game.clockOnTick.bind(game),
            onend: game.gameEnd.bind(game)
        });
    }

    start(time){
        this.timer.start(time || this.binded.options.timer.time);

    }

}