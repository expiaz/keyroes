'use strict';

var GameFactory = require('./../factory/GameFactory');
var constants = require('./../shared/constants');
var Clock = require('./Clock');
var Io = require('./../shared/Io');

class Match{

    constructor(){

        this.socketPool = Io.getInstance();

        this.players = Array.prototype.slice.call(arguments);

        if(Array.isArray(arguments[0]))
            this.players = arguments[0];

        this.counter = [];

        this.options = {
            timer: {
                tick: 0.1,
                time: 5,
                angle: 2
            }
        };

        this.id = "match" + this.players.reduce(function (gameId, player) {
            return gameId + player.getPublicId();
        }, this.players);

        this.clock = new Clock();
        this.clock.bind(this);

        this.players.forEach(function (player) {
            player.enterMatch(this);
        }.bind(this));

        this.clock.start(this.options.timer.time);
    }

    updatePlayerCounter(answer){
        this.counter.push(answer);
        this.socketPool.to(this.id).emit(constants.match.MAJ_COUNTER, this.counter);
    }

    clockTick(millis){
        var display = (millis/1000).toFixed(1);
        this.socketPool.to(this.id).emit(constants.match.CLOCK_TICK, {time: display, angle: this.options.timer.angle*display});
    }

    clockEnd(){
        let accepting = true;
        this.players.forEach(function (p) {
            accepting = accepting && p.getAnswer() === constants.match.ACCEPT_MATCH ? true : false;
        }.bind(this));
        if(accepting)
            GameFactory.create(this.players);
        else
            this.players.forEach(function (e) {
                e.abortMatch();
            });

    }

}

module.exports = Match;