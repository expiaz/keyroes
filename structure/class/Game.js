'use strict';

var clock = require('timer.js');
var io = require('../Io');
var connected = io.sockets.connected;


class Game{
    constructor(id,p1,p2){
        this.id = id;
        this.letter = 0;
        this.players = {
            p1: {
                id: p1,
                score: 0
            },
            p2: {
                id: p2,
                score: 0
            }
        }
        this.timer = {
            timer: 0,
            timerSettings : {
                tick: 1,
                time: 60
            }
        }
        this.Clock = {
            EventHandler: {
                TimeronTick: function(millis){
                    //io.to(this.id).emit("clockTick",millis);
                    console.log(this.id+" : "+millis);
                },
                TimeronEnd: function(){
                    console.log("end");
                },
                TimeronPause: function(){
                    console.log("paused");
                },
                TimeronStart: function(){
                    console.log("started");
                }
            },
            Modifier: {
                startClock: function(time){
                    this.timer.timer = new clock({
                        tick:this.timer.timerSettings.tick,
                        ontick: this.Clock.EventHandler.TimeronTick,
                        onend: this.Clock.EventHandler.TimeronEnd,
                        onpause: this.Clock.EventHandler.TimeronPause,
                        onstart: this.Clock.EventHandler.TimeronStart
                    });
                    this.timer.timer.start(time || this.timer.timerSettings.time);
                },

                pauseClock(){
                    if(this.timer.timer) this.timer.timer.pause();
                },

                restartClock(){
                    if(this.timer.timer) this.timer.timer.start();
                }
            },
            Getter: {
                getClockTime(){
                    if(this.timer.timer) this.timer.timer.getDuration();
                },

                getClockStatus(){
                    if(this.timer.timer) this.timer.timer.getStatus();
                }
            }
        }
        this.Clock.EventHandler.TimeronStart = this.Clock.EventHandler.TimeronStart.bind(this);
        this.Clock.EventHandler.TimeronTick = this.Clock.EventHandler.TimeronTick.bind(this);
        this.Clock.EventHandler.TimeronPause = this.Clock.EventHandler.TimeronPause.bind(this);
        this.Clock.EventHandler.TimeronEnd = this.Clock.EventHandler.TimeronEnd.bind(this);
        this.Clock.Modifier.startClock = this.Clock.Modifier.startClock.bind(this);
        this.Clock.Modifier.pauseClock = this.Clock.Modifier.pauseClock.bind(this);
        this.Clock.Modifier.restartClock = this.Clock.Modifier.restartClock.bind(this);
        this.Clock.Getter.getClockStatus = this.Clock.Getter.getClockStatus.bind(this);
        this.Clock.Getter.getClockTime = this.Clock.Getter.getClockTime.bind(this);
    }
}


module.exports = Game;