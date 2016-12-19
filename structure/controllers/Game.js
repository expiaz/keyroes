var GameModelRedis = require('./../model/redis/game');
var GameModelSql = require('./../model/sql/game');
var GameClass = require('./../Game');

var LetterModelRedis = require('./../model/redis/letter');

var Game = {
    Model:{
        Redis: GameModelRedis,
        Sql: GameModelSql
    }
};

module.exports = Game;