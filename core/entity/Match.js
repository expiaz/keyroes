'use strict';

var GameFactory = require('./../factory/GameFactory');
var constants = require('./../shared/constants');
var Clock = require('./Clock');
var Io = require('./../shared/Io');

class Match{

    constructor(players){



        this.socketPool = Io.getInstance();

        this.players = players;

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
            player.getSocket().emit(constants.queue.LEAVE_QUEUE_ACK);
            player.getSocket().join(this.id);
            player.enterMatch(this);
        }.bind(this));

        this.clock.start(this.options.timer.time);
    }

    updatePlayerCounter(answer){
        switch (answer){
            case constants.match.ACCEPT_MATCH:
                this.counter.push(true);
                break;
            case constants.match.DECLINE_MATCH:
                this.counter.push(false);
        }
        this.socketPool.to(this.id).emit(constants.match.MAJ_COUNTER, this.counter);
    }

    userLeave(user){
        let player = this.players.indexOf(user);
        if(player === -1)
            return;
        this.players[player].setAnswer(constants.match.DECLINE_MATCH);
        this.counter = Array(this.players.length).fill(false);
        this.socketPool.to(this.id).emit(constants.match.MAJ_COUNTER, this.counter);
    }

    clockTick(millis){
        var display = (millis/1000).toFixed(1);
        this.socketPool.to(this.id).emit(constants.match.CLOCK_TICK, {time: display, angle: this.options.timer.angle*display});
    }

    clockEnd(){

        this.socketPool.to(this.id).emit(constants.match.LEAVE_MATCH);

        let accepting = true;
        this.players.forEach(function (p) {
            let answer = p.getAnswer() === constants.match.ACCEPT_MATCH ? true : false;
            accepting = accepting && answer;
            p.getSocket().leave(this.id);
        }.bind(this));
        if(accepting){
            GameFactory.create(this.players);
        }
        else{
            this.players.forEach(function (p) {
                let answer = p.getAnswer() === constants.match.ACCEPT_MATCH ? true : false;
                if(answer)
                    p.enterQueue();
                else
                    p.abortMatch();
            });
        }


    }

}

module.exports = Match;