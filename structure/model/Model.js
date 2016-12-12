var userModel = require('./Redis_user');
var gameModel = require('./Redis_game');

var userSql = require('./Sql_user');
var gameSql = require('./Sql_game');

var Redis = {
    Users: userModel,
    Game: gameModel
}

var Sql = {
    Users: userSql,
    Game: gameSql
}

module.exports.Redis = Redis;
module.exports.Sql = Sql;