'use strict';



var constants = require('../utils/constants');

var clock = require('timer.js');
var io = require('../Io');
var connected = io.sockets.connected;


class Game{
    constructor(id,p1,p2){
        this.id = id;
        this.letter = 0;
        this.letters = [];
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
            settings : {
                tick: 1,
                time: 60,
                angle: 0.17
            }
        }
        this.Clock = {
            EventHandler: {
                TimeronTick: function(millis){
                    var display = (millis/1000).toFixed(1);
                    io.to(this.id).emit("clockTick",{time:display,angle:this.timer.settings.angle*display});
                    //console.log(this.id+" : "+millis);
                },
                TimeronEnd: function(){
                    this.gameEnd();
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
                        tick:this.timer.settings.tick,
                        ontick: this.Clock.EventHandler.TimeronTick,
                        onend: this.Clock.EventHandler.TimeronEnd,
                        onpause: this.Clock.EventHandler.TimeronPause,
                        onstart: this.Clock.EventHandler.TimeronStart
                    });
                    this.timer.timer.start(time || this.timer.settings.time);
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

    gameStart(){
        io.to(this.id).emit('gameStart');
        this.Clock.Modifier.startClock();
    }

    gameEnd(){

    }

    getLetterCode(){
        return Math.floor(Math.random() * 255) % 2 ? Math.floor(Math.random() * 25) + 97 : Math.floor(Math.random() * 25) + 65;
    }

    getLetterColor(){
        return [Math.floor(Math.random() * 255) + 1,Math.floor(Math.random() * 255) + 1,Math.floor(Math.random() * 255) + 1].join(',')
    }

    getLetterFont(){
        return constants.Letter.Font[Math.floor(Math.random() * constants.Letter.Font.length)];
    }

    genLetter(){
        return {
            letter:this.getLetterCode(),
            x:Math.floor(Math.random() * ( 100 )) + 1,
            y:Math.floor(Math.random() * ( 100 )) + 1,
            color: this.getLetterColor(),
            size: Math.floor(Math.random() * ( 15 )) + 10,
            font: this.getLetterFont()
        }
    }

    handleKeypress(sid,letter){
        var _l = this.getActualLetter(),
            l = letter == _l.letter ? [_l.letter,sid,1,_l.y,_l.x,_l.color,_l.size,_l.font].join('::') : [_l.letter,sid,0].join('::');

        this.letters.push(l);

        if(letter == _l.letter){
            this.letter = this.genLetter();
            this.getPlayerNumber(sid) == 1 ? this.players.p1.p1_score++ : this.players.p2.p2_score++;
            io.to(this.id).emit('k-letter',this.letter);
            io.to(this.id).emit('k-maj-letterHistory',this.getLetterHistory());
        }
        else this.getPlayerNumber(sid) == 1 ? (this.players.p1.p1_score > 0 ? this.players.p1.p1_score-- : null) : (this.players.p2.p2_score > 0 ? this.players.p2.p2_score-- : null);

        io.to(this.id).emit('k-maj-typedLetterHistory',this.getTypedLetterHistory());
        io.to(this.id).emit('k-maj-points',this.players);
    }

    getPlayerNumber(sid){
        return sid == this.players.p1.id ? 1 : 2;
    }

    getActualLetter(){
        return this.letter ? this.letter : undefined;
    }

    getLetterHistory(){
        if(!this.letters) return [];
        var ret = [];
        for(var i=0;i<this.letters.length;i++)
            if(this.letters[i].split('::')[2]) ret.push(this.letters[i]);
        return this.formatHistory(ret);
    }

    getTypedLetterHistory(){
        if(!this.letters) return [];
        return this.formatHistory(this.letters);
    }

    formatHistory(history){
        var ret = [];
        for(var i=0;i<history.length;i++)
            ret.push({
                user:Manager.User.get(history[i].split('::')[1]).username,
                letter:String.fromCharCode(history[i].split('::')[0]),
                answer:parseInt(history[i].split('::')[2]) ? true : false
            });
        return ret;
    }


}


module.exports = Game;