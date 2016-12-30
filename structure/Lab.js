var gameModel = require('./model/redis/game');
var gameClass = require('./Game');

gameModel.addGame(new gameClass('fesfe','rf','fesf'),function (err,res) {
    console.log(err);
})