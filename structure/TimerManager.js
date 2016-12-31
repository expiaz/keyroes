'use strict';

var clock = require('timer.js');

class TimerManager{
    constructor(){
        this.timers = [];
    }

    add(props){
        console.log(this.timers);
        this.timers[props.id] =
        {
            id: props.id,
            timer:new clock({
                tick:props.tick,
                ontick: props.ontick,
                onend: props.onend
            })
        };
        if(props.time) this.start(props.id,props.time);
    }

    start(id,time){
        console.log(this.timers[id]);
        if(this.timers[id]) this.timers[id].timer.start(time);
        console.log(this.timers[id]);
    }

    get(id){
        if(this.timers[id] && this.timers[id].timer._.status == 'started') return this.timers[id].timer.getDuration();
    }

    pause(id){
        if(this.timers[id]) this.timers[id].timer.pause();
    }

    restart(id){
        if(this.timers[id]) this.timers[id].timer.start();
    }

    stop(id){
        if(this.timers[id]) this.timers[id].timer.stop();
    }

    remove(id){
        if(this.timers[id]) this.timers[id].destroy();
    }


}

/*
var TimerManager = function(){
    this.timers = [];
    this.add = function(id,tick,ontick_cb,onend_cb){
        this.timers[id] = {
            timer:new timer_module({
                tick:tick,
                ontick: ontick_cb,
                onend: onend_cb
            }),
            id: id
        };
    }
    this.remove = function(id){
        if(this.timers[id]) this.timers[id].destroy();
        //this.timers.splice(this.timers.indexOf(this.timers.indexOfObj('id',id)),1);
    }
    this.start = function(id,time){
        if(this.timers[id]) this.timers[id].timer.start(time);
        //this.timers.indexOfObj('id',id).timer.start(time);
    }
    this.pause = function(id){
        if(this.timers[id]) this.timers[id].timer.pause();
        //this.timers.indexOfObj('id',id).timer.pause();
    }
    this.restart = function(id){
        if(this.timers[id]) this.timers[id].timer.start();
        //this.timers.indexOfObj('id',id).timer.start();
    }
    this.stop = function(id){
        if(this.timers[id]) this.timers[id].timer.stop();
        //this.timers.indexOfObj('id',id).timer.stop();
    }
}
*/

module.exports = new TimerManager();