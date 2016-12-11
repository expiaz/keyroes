var redis_user = require('./redis/Redis_user');
var redis_game = require('./redis/Redis_game');

module.exports.Users = redis_user;
module.exports.Game = redis_game;