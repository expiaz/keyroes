var GameModelRedis = require('./../model/redis/game');
var GameModelSql = require('./../model/sql/game');

var Game = {
    Model:{
        Redis: GameModelRedis,
        Sql: GameModelSql
    }
};

module.exports = Game;