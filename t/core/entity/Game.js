'use strict';


var constants = require('../shared/constants');
var Clock = require('./Clock');

var io = require('../shared/io');
var connected = io.sockets.connected;


class Game{

    constructor(){
        var p = Array.prototype.slice.call(arguments);

        this.players = {};
        p.forEach(function (player) {
            if(this.players.hasOwnProperty(player.getPublicId()) === false)
                this.players.setProperty(player.getPublicId(), {
                    player: player,
                    score: 0,
                    streak: 0
                });
        }.bind(this));

        this.id = p.reduce(function (gameId, player) {
            return gameId + player.getPublicId();
        }, this.players);

        this.letter = 0;
        this.letters = [];
        this.history = [];

        this.options = {
            timer: {
                tick: 1,
                time: 60,
                angle: 0.17
            }
        }
        this.clock = new Clock();
        this.clock.bindGame(this);
    }

    getPublicId(){
        return this.id;
    }

    clockOnTick(millis){
        var display = (millis/1000).toFixed(1);
        io.to(this.id).emit("clockTick", {time: display, angle: this.timer.settings.angle*display});
    }

    gameStart(){
        io.to(this.id).emit('gameStart');
        this.clock.start(this.options.timer.time);
    }

    gameEnd(){

    }

    /*

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
        return this.letter;
    }

    getLetterHistory(){
        if(!this.letters) return [];
        var ret = [];
        for(var i=0;i<this.letters.length;i++)
            if(this.letters[i].split('::')[2]) ret.push(this.letters[i]);
        return this.formatHistory(ret);
    }

    getHistory(){
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

    */

}


module.exports = Game;