'use strict';


var constants = require('../shared/constants');
var Clock = require('./Clock');
var LetterFactory = require('./../factory/LetterFactory');
var Map = require('./../shared/Map');
var Io = require('./../shared/Io');

var GameManager = require('../manager/GameManager');

class Game{

    constructor(){

        this.socketPool = Io.getInstance();

        this.spectators =  [];

        let players = Array.prototype.slice.call(arguments);
        if(Array.isArray(players[0]))
            players = players[0];

        this.id = players.reduce(function (gameId, player) {
            return gameId + player.getPublicId();
        }, "game");

        this.players = new Map();
        players.forEach(function (player) {
            this.players.add(player.getPublicId(), {
                user: player,
                score: 0,
                streak: 1,
                good_answer: 0,
                bad_answer: 0
            });
            player.enterGame(this);
        }.bind(this));

        this.letter;
        this.deathLetter;
        this.letters = [];
        this.history = [];
        this.score = [];
        this.options = {
            timer: {
                tick: 1,
                time: 60,
                angle: 0.17
            }
        };

        this.clock = new Clock();
        this.clock.bind(this);

        GameManager.add(this);

        this.startGame();
    }

    getPublicId(){
        return this.id;
    }

    addSpectator(player){
        player.enterSpectate(this);
        this.spectators.push(player);
    }

    removeSpectator(player){
        let i = this.spectators.indexOf(player),
            p = this.spectators[i];
        p.leaveSpectate(this);
        this.spectators.splice(i, 1);
    }

    clockTick(millis){
        var display = (millis/1000).toFixed(1);
        this.socketPool.to(this.id).emit(constants.game.CLOCK_TICK, {
            time: display,
            angle: this.options.timer.angle*display
        });
    }

    clockEnd(){
        this.endGame();
    }

    startGame(){
        this.socketPool.to(this.id).emit(constants.game.ENTER_GAME);
        this.letter = LetterFactory.create();
        this.deathLetter = LetterFactory.create();
        this.clock.start(this.options.timer.time);
        this.sendLetter();
        this.sendDeathLetter();
    }

    handleKeypress(player, letterCode){

        console.log('Game::handleKeyPress ',player.getUsername(), letterCode)

        let p = this.players.get(player.getPublicId());
        if(p === void 0) return;

        let valid = 0;
        if(this.letter.getCode() == letterCode){
            //valid answer
            valid = 1;

            let p = this.players.get(player.getPublicId());
            p.good_answer++;
            p.score = p.score + (p.streak * 1);
            p.streak = p.streak + 1;

            this.letters.push(this.letter);
            do{
                this.letter = LetterFactory.create();
            }while(this.letter.getCode() === this.deathLetter.getCode());
            this.sendLetter();
        }
        else if(this.deathLetter.getCode() == letterCode){
            valid = -1;
            let p = this.players.get(player.getPublicId())
            p.score = p.score - p.streak * 1 > 0 ? p.score - p.streak * 1 : 0;
            p.streak = 1;
            p.bad_answer++;
            do{
                this.deathLetter = LetterFactory.create();
            }while(this.deathLetter.getCode() === this.letter.getCode());
            this.sendDeathLetter();
        }
        else{
            valid = 0
            let p = this.players.get(player.getPublicId())
            p.score = p.score - (p.score > 0 ? 1 : 0);
            p.streak = 1;
            p.bad_answer++;
        }
        this.historyze(player, letterCode, valid);
        this.score = this.getActualScore();
        console.log('Game::actualScore', this.score)
        this.socketPool.to(this.id).emit(constants.game.MAJ_HISTORY, this.history);
        this.socketPool.to(this.id).emit(constants.game.MAJ_POINTS, this.score);
    }

    getActualScore(){
        return this.players.keys.map(function (e) {
            let pl = this.players.get(e);
            return {
                username: pl.user.getUsername(),
                score: pl.score,
                streak: pl.streak
            };
        }.bind(this));
    }

    sendLetter(){
        this.socketPool.to(this.id).emit(constants.game.NEXT_LETTER, this.letter.objectize());
    }

    sendDeathLetter(){
        this.socketPool.to(this.id).emit(constants.game.NEXT_DEATH_LETTER, this.deathLetter.objectize());
    }

    historyze(p, lcode, valid){
        this.history.push({
            user: p.getUsername(),
            valid: valid,
            code: lcode
        });
    }

    userLeave(player){

    }

    endGame(){
        this.socketPool.to(this.id).emit(constants.game.FINISH_GAME);
        this.players.getKeys().forEach(function (e) {
            let p = this.players.get(e).user;
            p.leaveGame(this);
        }.bind(this));
        this.spectators.forEach(function (e) {
            e.leaveSpectate(this);
        }.bind(this));

        GameManager.remove(this);
    }

    reconcile(player){
        player.getSocket().join(this.getPublicId());
    }

    getActualState(){
        return {
            scores: this.getActualScore(),
            history: this.history.slice(),
            id: this.getPublicId()
        }
    }

    /*

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