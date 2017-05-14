'use strict';

var Timer = require('timer.js');

class Clock{

    constructor(){
        this.timer = new Timer();
        this.binded;
    }

    bind(object){
        this.binded = object;
        this.timer.options({
            tick: object.options.timer.tick,
            ontick: object.clockTick.bind(object),
            onend: object.clockEnd.bind(object)
        });
    }

    start(time){
        this.timer.start(time || this.binded.options.timer.time);

    }

    getTime(){
        return this.timer.getDuration();
    }

}

module.exports = Clock;