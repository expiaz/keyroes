var userRedis = require('./redis/user');
var gameRedis = require('./redis/game');

var userSql = require('./sql/user');
var gameSql = require('./sql/game');

var Redis = {
    User: userRedis,
    Game: gameRedis
}

var Sql = {
    User: userSql,
    Game: gameSql
}

module.exports.Redis = Redis;
module.exports.Sql = Sql;