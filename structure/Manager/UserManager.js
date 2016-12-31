'use strict';

var user = require('./../class/User');

class UserManager{
    constructor(){
        this.users = [];
    }

    add(user){
        if(!this.users[user.id]) this.users[user.id] = user;
        else this.update(user);
    }

    update(user){
        if(this.users[user.id]) this.users[user.id] = user;
    }

    get(id){
        if(this.users[id]) return this.users[id];
    }

    startClock(id,time){
        if(!this.users[id]) throw new Error(" user "+id+" doesn't exists");
        this.users[id].timer.timer = new clock({
            tick:this.users[id].timer.timerSettings.tick,
            ontick: this.users[id].Clock.EventHandler.TimeronTick.bind(this.users[id]),
            onend: this.users[id].Clock.EventHandler.TimeronEnd.bind(this.users[id]),
            onpause: this.users[id].Clock.EventHandler.TimeronPause.bind(this.users[id]),
            onstart: this.users[id].Clock.EventHandler.TimeronStart.bind(this.users[id])
        });
        this.users[id].timer.timer.start(time || this.users[id].timer.timerSettings.time);
    }

    pauseClock(id){
        if(this.users[id]) this.users[id].timer.timer.pause();
    }

    restartClock(id){
        if(this.users[id]) this.users[id].timer.timer.start();
    }

    getClockTime(id){
        if(this.users[id]) return this.users[id].timer.timer.getDuration();
    }

    getClockStatus(id){
        if(this.users[id]) return this.users[id].timer.timer.getStatus();
    }
}

module.exports = new UserManager();