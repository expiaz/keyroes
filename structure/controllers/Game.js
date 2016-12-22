var GameModelRedis = require('./../model/redis/game');
var GameModelSql = require('./../model/sql/game');

var LetterModelRedis = require('./../model/redis/letter');

var Game = {
    Model:{
        Redis: GameModelRedis,
        Sql: GameModelSql
    },
    getActualLetter:getActualLetter,
    addLetterToGame:addLetterToGame,
};

module.exports = Game;

function getActualLetter(game_id,fn){
    GameModelRedis.getGame(game_id,["letter"],function (err,letter_id) {
        if(err) return fn(true,letter_id);
        LetterModelRedis.getLetter(letter_id,function (err,letter) {
            if(err) return fn(true,letter);
            fn(false,letter);
        });
    });
}

function addLetterToGame(game_id,fn){
    //ajouter la letter:id
    //modif letter game:gid
    LetterModelRedis.addLetter(game_id,function (err,letter_id_added) {
        if(err) return fn(true,letter_id_added);
        GameModelRedis.setGame(game_id,{letter:letter_id_added},function (err,res) {
            if(err) return fn(true,res);
            fn(false,res);
        });
    });
}