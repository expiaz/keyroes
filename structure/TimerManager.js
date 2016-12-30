var timer_module = require('timer.js');

Array.prototype.indexOfObj || (Array.prototype.indexOfObj = function(prop, value) {
    return this[this.map(function (e){return e.hasOwnProperty(prop) ? e[prop] : undefined;}).indexOf(value)]
});

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

module.exports = new TimerManager();